export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const subject = String(payload.subject || "").trim();
    const message = String(payload.message || "").trim();

    if (!name || !email || !subject || !message) {
      return Response.json(
        { success: false, message: "Please fill in all fields before sending." },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();

    if (!accessKey) {
      return Response.json(
        {
          success: false,
          message: "Contact email service is not configured yet. Add WEB3FORMS_ACCESS_KEY to your deployment environment."
        },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: `[Portfolio] ${subject}`,
        message,
        from_name: name,
        replyto: email
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Web3Forms delivery error:", result);
      return Response.json(
        {
          success: false,
          message: "Unable to send message right now. Please try again later.",
          result
        },
        { status: 502 }
      );
    }

    return Response.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Contact form API error:", error);
    return Response.json(
      { success: false, message: "Unable to send message right now. Please try again later." },
      { status: 500 }
    );
  }
}
