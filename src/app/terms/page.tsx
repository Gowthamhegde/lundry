import LegalPage from "@/components/LegalPage";

// [Draft - review with a lawyer]
export default function TermsPage() {
  return <LegalPage title="Terms & Conditions">
    <p>These draft terms apply to RinseUp laundry services in Bengaluru, Karnataka. By using the service, you agree to provide accurate information and follow these terms.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Service and payment</h2>
    <p>RinseUp provides the services and prices shown in the app. Razorpay processes online payments; RinseUp does not ask for or store card numbers, CVV, or UPI PINs. Orders are confirmed after successful payment verification.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Garments and responsibility</h2>
    <p>Customers should identify special care requirements and remove personal items before pickup. Cleaning outcomes can vary with fabric, age, stains, colour fastness, and pre-existing wear. Any claim process, liability limit, and claim window must be confirmed with RinseUp before relying on this draft.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Cancellation and conduct</h2>
    <p>No cancellations are currently offered. Users must not misuse the app, submit unlawful content, interfere with service operation, or access another person&apos;s account. RinseUp may suspend access where necessary to protect users or the service.</p>
    <h2 className="text-xl font-black text-[var(--color-text-primary)]">Law and contact</h2>
    <p>These terms are intended for India and require legal review before publication. Questions and complaints may be sent to Gowtham at gowthamhegde606@gmail.com.</p>
  </LegalPage>;
}
