import LegalPage from "@/components/LegalPage";

// [Draft - review with a lawyer]
export default function CookiesPage() {
  return <LegalPage title="Cookie Policy">
    <p>RinseUp currently does not use analytics, advertising, chat, or tracking cookies.</p>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead><tr><th className="border-b p-2">Storage</th><th className="border-b p-2">Purpose</th><th className="border-b p-2">Duration</th><th className="border-b p-2">Category</th></tr></thead>
        <tbody>
          <tr><td className="border-b p-2">Supabase Auth storage</td><td className="border-b p-2">Keep a signed-in session</td><td className="border-b p-2">Until expiry/sign-out</td><td className="border-b p-2">Strictly necessary</td></tr>
          <tr><td className="border-b p-2">theme</td><td className="border-b p-2">Remember theme choice</td><td className="border-b p-2">Until removed</td><td className="border-b p-2">Preference</td></tr>
          <tr><td className="border-b p-2">selected_services</td><td className="border-b p-2">Carry selected services into checkout</td><td className="border-b p-2">Until cleared</td><td className="border-b p-2">Strictly necessary</td></tr>
          <tr><td className="border-b p-2">last_order</td><td className="border-b p-2">Show recent order state locally</td><td className="border-b p-2">Until removed</td><td className="border-b p-2">Preference</td></tr>
          <tr><td className="border-b p-2">rinseup_cookie_consent</td><td className="border-b p-2">Record consent choice, time, and policy version</td><td className="border-b p-2">Until removed</td><td className="border-b p-2">Consent</td></tr>
        </tbody>
      </table>
    </div>
  </LegalPage>;
}
