import LegalPage from "@/components/LegalPage";

// [Draft - review with a lawyer]
export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy">
    <p>RinseUp, based in Bengaluru, Karnataka, collects information needed to provide laundry pickup, cleaning, delivery, payment, account, and support services.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Information we collect</h2>
    <p>We collect your name, email address, phone number, pickup address, pickup preferences, order contents, notes, payment status, and account identifiers. Google sign-in may provide your name and email. Do not submit card numbers, CVV, UPI PINs, or other payment credentials to RinseUp.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Why we use it</h2>
    <p>We use this information to create accounts, authenticate users, arrange service, process Razorpay payments, track orders, provide support, prevent abuse, and maintain business records. Consent is requested where required; service delivery may also require processing necessary for your requested order.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Sharing and retention</h2>
    <p>Information may be shared with Supabase for hosting and authentication, Razorpay for payment processing, and service or delivery personnel needed to fulfil an order. We retain information only for as long as needed for these purposes and applicable tax, accounting, dispute, or legal requirements. A specific deletion schedule is not yet configured.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Your choices</h2>
    <p>You may request access, correction, deletion, or a copy of your personal information, and withdraw consent where processing is based on consent, by emailing the address below. We will verify the request and respond as required by applicable law. You may also complain to our Grievance Officer, Gowtham, at the same email.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Children and incidents</h2>
    <p>RinseUp is not intentionally directed at children under 18. We do not knowingly use children&apos;s data for advertising or tracking. If you believe data has been exposed, contact us promptly so we can investigate and take appropriate steps.</p>
  </LegalPage>;
}
