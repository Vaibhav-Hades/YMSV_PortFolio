import { resumeData } from "../../../components/resumeData";

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

    const form = new URLSearchParams();
    form.append("name", name);
    form.append("email", email);
    form.append("_subject", subject ? `[Portfolio] ${subject}` : `New message from ${name}`);
    form.append("message", message);
    form.append("_captcha", "false");
    form.append("_template", "table");

    const response = await fetch(`https://formsubmit.co/ajax/${resumeData.email}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      return Response.json(
        { success: false, message: "Unable to send message right now. Please try again later.", result },
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
