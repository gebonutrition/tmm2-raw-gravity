export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email, landing, source, creative } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, error: "Valid email is required" });
    }

    const cleanEmail = email.trim();
    const cleanLanding = String(landing || "tmm2").trim();
    const rawSource = String(source || "meta").trim().toLowerCase();
    const cleanSource = ["tiktok", "meta", "klaviyo", "instagram"].includes(rawSource) ? rawSource : "meta";
    const cleanCreative = String(creative || "unknown").trim();

    const apiKey = process.env.KLAVIYO_API_KEY || process.env.KLAVIYO_PRIVATE_API_KEY;
    const listId = process.env.KLAVIYO_LIST_ID;

    if (!apiKey || !listId) {
      console.error("Missing Klaviyo environment variables");
      return res.status(500).json({ success: false, error: "Klaviyo is not configured" });
    }

    const headers = {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Revision: "2026-07-15"
    };

    const profileResponse = await fetch("https://a.klaviyo.com/api/profile-import", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "profile",
          attributes: {
            email: cleanEmail,
            properties: {
              landing: cleanLanding,
              source: cleanSource,
              creative: cleanCreative
            }
          }
        }
      })
    });

    const profileText = await profileResponse.text();

    if (!profileResponse.ok) {
      console.error("Klaviyo profile error:", profileResponse.status, profileText);
      return res.status(502).json({ success: false, error: "Klaviyo profile update failed" });
    }

    const subscribeResponse = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [{
                type: "profile",
                attributes: {
                  email: cleanEmail,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED"
                      }
                    }
                  }
                }
              }]
            }
          },
          relationships: {
            list: {
              data: {
                type: "list",
                id: listId
              }
            }
          }
        }
      })
    });

    const subscribeText = await subscribeResponse.text();

    if (!subscribeResponse.ok) {
      console.error("Klaviyo subscription error:", subscribeResponse.status, subscribeText);
      return res.status(502).json({ success: false, error: "Klaviyo subscription failed" });
    }

	const amazonUrls = {
	  tiktok:
		"https://www.amazon.com/dp/B0GTWJ3K1R?maas=maas_adg_3383CD7D3C5EF97F6CCA7D1718E879D6_afap_abs&ref_=aa_maas&tag=maas",

	  meta:
		"https://www.amazon.com/dp/B0GTWJ3K1R?maas=maas_adg_E46438738C584A5A7808A36BE63B2723_afap_abs&ref_=aa_maas&tag=maas",

	  google:
		"https://www.amazon.com/dp/B0GTWJ3K1R?maas=maas_adg_8A567DA40D5364D338FB21A1EF04734E_afap_abs&ref_=aa_maas&tag=maas",

	  youtube:
		"https://www.amazon.com/dp/B0GTWJ3K1R?maas=maas_adg_9D2E5EAFE36AC7966B2405FF99644329_afap_abs&ref_=aa_maas&tag=maas",

	  dv360:
		"https://www.amazon.com/dp/B0GTWJ3K1R?maas=maas_adg_9986EB1E2475865D64AA28A04713BA29_afap_abs&ref_=aa_maas&tag=maas"
	};

    return res.status(200).json({
      success: true,
      amazonUrl: amazonUrls[cleanSource] || amazonUrls.meta
    });

  } catch (error) {
    console.error("TMM2 Vercel API error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}