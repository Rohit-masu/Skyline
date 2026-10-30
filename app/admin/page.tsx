import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_COOKIE, adminPassword, isValidSession } from "@/lib/admin-auth";
import { listEnquiries, storageMode } from "@/lib/storage/enquiries";
import { getPropertyBySlug } from "@/lib/properties";
import { login, logout } from "./actions";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false, follow: false } };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const dateTime = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

function LoginForm({ failed }: { failed: boolean }) {
  return (
    <form action={login} className="mx-auto max-w-sm space-y-4 rounded-2xl border border-brass/20 bg-[#0e1624] p-8">
      <h1 className="font-display text-2xl">Enquiries</h1>
      <label htmlFor="admin-password" className="block text-xs text-mist">Admin password</label>
      <input id="admin-password" name="password" type="password" required autoComplete="current-password"
        aria-invalid={failed} aria-describedby={failed ? "admin-error" : undefined} className="field px-4 py-3" />
      {failed && <p id="admin-error" className="text-xs text-red-400">Wrong password.</p>}
      <button type="submit" className="btn-brass w-full cursor-pointer rounded-xl py-3 text-xs uppercase tracking-widest">Sign in</button>
    </form>
  );
}

async function AdminContent({ searchParams }: { searchParams: SearchParams }) {
  if (!adminPassword()) {
    return <p className="text-center text-mist">The admin page is off. Set ADMIN_PASSWORD to turn it on.</p>;
  }

  const session = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidSession(session)) {
    return <LoginForm failed={(await searchParams).error === "1"} />;
  }

  const enquiries = await listEnquiries();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Enquiries</h1>
          <p className="text-xs text-mist">{enquiries.length} most recent · storage: {storageMode}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-outline-brass cursor-pointer rounded-xl px-4 py-2 text-xs">Sign out</button>
        </form>
      </div>

      {enquiries.length === 0 ? (
        <p className="rounded-2xl border border-white/10 p-8 text-center text-mist">No enquiries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate text-xs uppercase tracking-wider text-mist">
              <tr>
                <th scope="col" className="p-3">Received</th>
                <th scope="col" className="p-3">Home</th>
                <th scope="col" className="p-3">Name</th>
                <th scope="col" className="p-3">Contact</th>
                <th scope="col" className="p-3">Visit</th>
                <th scope="col" className="p-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="align-top">
                  <td className="whitespace-nowrap p-3 text-mist">{dateTime.format(new Date(enquiry.createdAt))}</td>
                  <td className="p-3">
                    <Link href={`/properties/${enquiry.propertySlug}`} className="text-brass hover:underline">
                      {getPropertyBySlug(enquiry.propertySlug)?.title ?? enquiry.propertySlug}
                    </Link>
                  </td>
                  <td className="p-3">{enquiry.name}</td>
                  <td className="p-3">
                    <a href={`tel:+91${enquiry.phone}`} className="hover:text-brass">+91 {enquiry.phone}</a>
                    {enquiry.email && <span className="block text-xs text-mist">{enquiry.email}</span>}
                  </td>
                  <td className="whitespace-nowrap p-3">{enquiry.visitDate}</td>
                  <td className="max-w-xs p-3 text-ivory-dim">{enquiry.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main id="main" className="mx-auto min-h-screen max-w-7xl px-4 py-16 sm:px-8">
      <Suspense fallback={<p className="text-center text-mist">Loading…</p>}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
