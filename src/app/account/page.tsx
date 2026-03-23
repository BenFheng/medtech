"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Tab = "details" | "purchases" | "notes";

const mockPurchases = [
  { id: "ORD-2024-001", date: "2026-03-01", stack: "The Longevity Stack v2.4", amount: 189, status: "Delivered",
    items: [
      { name: "NMN", dosage: "500mg", price: 28 },
      { name: "Trans-Resveratrol", dosage: "500mg", price: 22 },
      { name: "CoQ10 Ubiquinol", dosage: "200mg", price: 24 },
      { name: "PQQ", dosage: "20mg", price: 18 },
      { name: "Astaxanthin", dosage: "12mg", price: 16 },
      { name: "Omega-3 EPA/DHA", dosage: "2000mg", price: 18 },
      { name: "Vitamin D3", dosage: "5000IU", price: 6 },
      { name: "Vitamin K2 MK-7", dosage: "200mcg", price: 10 },
    ]},
  { id: "ORD-2024-002", date: "2026-02-01", stack: "The Longevity Stack v2.3", amount: 189, status: "Delivered",
    items: [
      { name: "NMN", dosage: "500mg", price: 28 },
      { name: "Trans-Resveratrol", dosage: "500mg", price: 22 },
      { name: "CoQ10 Ubiquinol", dosage: "200mg", price: 24 },
      { name: "PQQ", dosage: "20mg", price: 18 },
      { name: "Astaxanthin", dosage: "12mg", price: 16 },
      { name: "Omega-3 EPA/DHA", dosage: "2000mg", price: 18 },
      { name: "Vitamin D3", dosage: "5000IU", price: 6 },
      { name: "Vitamin K2 MK-7", dosage: "200mcg", price: 10 },
    ]},
  { id: "ORD-2024-003", date: "2026-01-01", stack: "The Cognitive Stack v1.8", amount: 169, status: "Delivered",
    items: [
      { name: "L-Theanine", dosage: "200mg", price: 8 },
      { name: "Alpha-GPC", dosage: "300mg", price: 16 },
      { name: "Lion's Mane", dosage: "1000mg", price: 22 },
      { name: "Bacopa Monnieri", dosage: "300mg", price: 12 },
      { name: "Phosphatidylserine", dosage: "100mg", price: 14 },
      { name: "Omega-3 EPA/DHA", dosage: "2000mg", price: 18 },
      { name: "Creatine Monohydrate", dosage: "5g", price: 8 },
    ]},
];

const mockNotes = [
  {
    id: 1,
    date: "2026-03-10",
    doctor: "Dr. Sarah Chen",
    summary: "Quarterly review — mitochondrial markers improved. Recommend continuing CoQ10 protocol. Consider adding PQQ next cycle.",
  },
  {
    id: 2,
    date: "2026-01-15",
    doctor: "Dr. Sarah Chen",
    summary: "Initial consultation. Patient reports afternoon fatigue and poor sleep architecture. Baseline bloodwork ordered. Starting with foundational stack.",
  },
];

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockPurchases[0] | null>(null);
  const [accountSubTab, setAccountSubTab] = useState<"personal" | "security">("personal");
  const [postalCode, setPostalCode] = useState("");
  const [block, setBlock] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [postalError, setPostalError] = useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneCode, setPhoneCode] = useState("+65");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState<"idle" | "verify">("idle");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingEmailResource, setPendingEmailResource] = useState<any>(null);

  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
    if (isLoaded && user && !profileLoaded) {
      // Set initial values from Clerk as fallback
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setProfileLoaded(true);

      // Load all profile data from Supabase (source of truth)
      fetch("/api/account/update")
        .then((res) => res.json())
        .then((data) => {
          if (data.firstName) setFirstName(data.firstName);
          if (data.lastName) setLastName(data.lastName);
          setPhoneCode(data.phoneCode || "+65");
          setPhone(data.phoneNumber || "");
          setPostalCode(data.postalCode || "");
          setBlock(data.block || "");
          setStreet(data.street || "");
          setUnitNumber(data.unitNumber || "");
          setBuilding(data.building || "");
        })
        .catch(() => {});
    }
  }, [isLoaded, user, router, profileLoaded]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    setProfileSuccess(false);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedPhone = phone.trim();

    setFirstName(trimmedFirst);
    setLastName(trimmedLast);
    setPhone(trimmedPhone);

    try {
      // Update Clerk (name)
      await user.update({ firstName: trimmedFirst, lastName: trimmedLast });

      // Update Supabase (name + phone)
      await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: trimmedFirst,
          lastName: trimmedLast,
          phoneCode,
          phoneNumber: trimmedPhone,
        }),
      });

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      // silently fail
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;
    setPasswordError("");
    if (user.passwordEnabled && !currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    setPasswordSaving(true);
    setPasswordSuccess(false);
    try {
      if (user.passwordEnabled) {
        await user.updatePassword({ currentPassword, newPassword, signOutOfOtherSessions: false });
      } else {
        await user.updatePassword({ newPassword, signOutOfOtherSessions: false });
      }
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordError(message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setAddressSaving(true);
    setAddressSuccess(false);
    try {
      await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postalCode: postalCode.trim(),
          block: block.trim(),
          street: street.trim(),
          unitNumber: unitNumber.trim(),
          building: building.trim(),
        }),
      });
      setAddressSuccess(true);
      setTimeout(() => setAddressSuccess(false), 3000);
    } catch {
      // silently fail
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!user) return;
    setEmailError("");
    if (!newEmail || !newEmail.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailSaving(true);
    try {
      const emailAddress = await user.createEmailAddress({ email: newEmail });
      await emailAddress.prepareVerification({ strategy: "email_code" });
      setPendingEmailResource(emailAddress);
      setEmailStep("verify");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send verification code.";
      setEmailError(message);
    } finally {
      setEmailSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!user || !pendingEmailResource) return;
    setEmailError("");
    setEmailSaving(true);
    try {
      const verified = await pendingEmailResource.attemptVerification({ code: emailCode });
      const oldPrimaryId = user.primaryEmailAddressId;
      await user.update({ primaryEmailAddressId: verified.id });
      // Remove old email address
      if (oldPrimaryId && oldPrimaryId !== verified.id) {
        const oldEmail = user.emailAddresses.find((e: { id: string }) => e.id === oldPrimaryId);
        if (oldEmail) await oldEmail.destroy();
      }
      setEmailSuccess(true);
      setEmailStep("idle");
      setNewEmail("");
      setEmailCode("");
      setPendingEmailResource(null);
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid verification code.";
      setEmailError(message);
    } finally {
      setEmailSaving(false);
    }
  };

  const handleCancelEmailChange = () => {
    if (pendingEmailResource) {
      pendingEmailResource.destroy().catch(() => {});
    }
    setEmailStep("idle");
    setNewEmail("");
    setEmailCode("");
    setEmailError("");
    setPendingEmailResource(null);
  };

  useEffect(() => {
    if (postalCode.length !== 6) {
      setPostalError("");
      return;
    }

    const lookup = async () => {
      setPostalLoading(true);
      setPostalError("");
      try {
        const res = await fetch(
          `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y`
        );
        const data = await res.json();
        const match = data.results?.find(
          (r: { POSTAL: string }) => r.POSTAL === postalCode
        );
        if (match) {
          setBlock(match.BLK_NO || "");
          setStreet(match.ROAD_NAME || "");
          setBuilding(match.BUILDING === "NIL" ? "" : match.BUILDING || "");
          setPostalError("");
        } else {
          setBlock("");
          setStreet("");
          setBuilding("");
          setPostalError("No address found for this postal code.");
        }
      } catch {
        setPostalError("Unable to verify postal code. Please try again.");
      } finally {
        setPostalLoading(false);
      }
    };

    lookup();
  }, [postalCode]);

  if (!isLoaded || !user) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="h-12 w-12 rounded-full border-4 border-primary-fixed border-t-primary animate-spin" style={{ animationDuration: "1.5s" }} />
        </main>
      </>
    );
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "details", label: "Account Details", icon: "person" },
    { key: "purchases", label: "Purchase History", icon: "receipt_long" },
    { key: "notes", label: "Doctor Notes", icon: "clinical_notes" },
  ];

  return (
    <>
      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-xl text-on-surface">{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex items-center justify-between mb-4 text-sm text-on-surface-variant">
              <span>{selectedOrder.date}</span>
              <span className="inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-headline font-bold text-on-primary-fixed">
                {selectedOrder.status}
              </span>
            </div>
            <p className="text-sm font-headline font-bold text-on-surface mb-4">{selectedOrder.stack}</p>
            <div className="space-y-3 mb-4">
              {selectedOrder.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-surface-container last:border-0">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">{item.dosage}</p>
                  </div>
                  <span className="text-sm font-bold text-on-surface">${item.price}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t-2 border-primary/20">
              <span className="font-headline font-bold text-on-surface">Total</span>
              <span className="font-headline font-bold text-primary text-lg">${selectedOrder.amount}</span>
            </div>
          </div>
        </div>
      )}

      <Navbar />
      <main className="mx-auto px-4 sm:px-8 py-12" style={{maxWidth: '1024px', width: '100%'}}>
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-headline font-extrabold text-5xl tracking-tight text-on-surface mb-2">
            Your Account
          </h1>
          <p className="text-lg text-on-surface-variant font-body">
            Manage your profile, review past orders, and access your clinical notes.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-outline-variant">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 font-headline font-semibold text-sm transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <section className="space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
              <div className="px-8 pt-8 pb-0">
                <h2 className="font-headline font-bold text-xl text-on-surface mb-6">Account Information</h2>
                <div className="flex gap-1 border-b border-outline-variant">
                  {([
                    { key: "personal" as const, label: "Personal Information" },
                    { key: "security" as const, label: "Email & Password" },
                  ]).map((sub) => (
                    <button
                      key={sub.key}
                      onClick={() => setAccountSubTab(sub.key)}
                      className={`px-4 py-2.5 font-headline font-semibold text-sm transition-colors border-b-2 -mb-px ${
                        accountSubTab === sub.key
                          ? "text-primary border-primary"
                          : "text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 space-y-6">
                {accountSubTab === "personal" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          className="rounded-xl border border-outline-variant bg-surface px-3 py-3 font-body text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="+65">🇸🇬 +65</option>
                          <option value="+60">🇲🇾 +60</option>
                          <option value="+62">🇮🇩 +62</option>
                          <option value="+66">🇹🇭 +66</option>
                          <option value="+63">🇵🇭 +63</option>
                          <option value="+84">🇻🇳 +84</option>
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+86">🇨🇳 +86</option>
                          <option value="+81">🇯🇵 +81</option>
                          <option value="+82">🇰🇷 +82</option>
                          <option value="+852">🇭🇰 +852</option>
                          <option value="+886">🇹🇼 +886</option>
                          <option value="+61">🇦🇺 +61</option>
                          <option value="+64">🇳🇿 +64</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+1">🇺🇸 +1</option>
                        </select>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                          placeholder="Phone number"
                          className="flex-1 rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={profileSaving}
                        className="vitality-gradient text-on-primary px-8 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                      >
                        {profileSaving ? "Saving..." : "Save Changes"}
                      </button>
                      {profileSuccess && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          Saved
                        </span>
                      )}
                    </div>
                  </>
                )}

                {accountSubTab === "security" && (
                  <>
                    {/* Email */}
                    <div className="space-y-4">
                      <label className="block text-sm font-headline font-semibold text-on-surface-variant">
                        Email Address
                      </label>
                      <p className="text-sm text-on-surface font-body">{user.primaryEmailAddress?.emailAddress}</p>

                      {emailStep === "idle" && (
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <input
                              type="email"
                              placeholder="New email address"
                              value={newEmail}
                              onChange={(e) => { setNewEmail(e.target.value); setEmailError(""); }}
                              className="flex-1 rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            <button
                              onClick={handleSendEmailCode}
                              disabled={emailSaving || !newEmail}
                              className="vitality-gradient text-on-primary px-6 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                            >
                              {emailSaving ? "Sending..." : "Change Email"}
                            </button>
                          </div>
                          {emailSuccess && (
                            <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                              Email updated
                            </span>
                          )}
                        </div>
                      )}

                      {emailStep === "verify" && (
                        <div className="space-y-3">
                          <p className="text-sm text-on-surface-variant">
                            We sent a verification code to <span className="font-semibold text-on-surface">{newEmail}</span>
                          </p>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="Enter code"
                              value={emailCode}
                              onChange={(e) => { setEmailCode(e.target.value); setEmailError(""); }}
                              className="flex-1 rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            <button
                              onClick={handleVerifyEmail}
                              disabled={emailSaving || !emailCode}
                              className="vitality-gradient text-on-primary px-6 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                            >
                              {emailSaving ? "Verifying..." : "Verify"}
                            </button>
                            <button
                              onClick={handleCancelEmailChange}
                              className="rounded-xl border border-outline-variant px-4 py-3 font-headline font-bold text-sm text-on-surface-variant hover:text-on-surface transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {emailError && (
                        <p className="text-sm text-error flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">error</span>
                          {emailError}
                        </p>
                      )}
                    </div>

                    <hr className="border-outline-variant" />

                    {/* Password */}
                    <div className="space-y-4">
                      <label className="block text-sm font-headline font-semibold text-on-surface-variant">
                        Password
                      </label>
                      <p className="text-xs text-on-surface-variant">
                        {!user.passwordEnabled && "Set a password to enable email & password sign-in."}
                      </p>

                      {user.passwordEnabled && (
                        <div>
                          <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>

                      {passwordError && (
                        <p className="text-sm text-error flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">error</span>
                          {passwordError}
                        </p>
                      )}

                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleUpdatePassword}
                          disabled={passwordSaving}
                          className="vitality-gradient text-on-primary px-8 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                        >
                          {passwordSaving ? "Updating..." : user.passwordEnabled ? "Update Password" : "Set Password"}
                        </button>
                        {passwordSuccess && (
                          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Updated
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 space-y-6">
              <h2 className="font-headline font-bold text-xl text-on-surface">Shipping Address</h2>

              <div>
                <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                  Postal Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                    className={`w-full rounded-xl border bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      postalError ? "border-error" : "border-outline-variant"
                    }`}
                  />
                  {postalLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-5 w-5 rounded-full border-2 border-primary-fixed border-t-primary animate-spin" />
                    </div>
                  )}
                </div>
                {postalError && (
                  <p className="text-xs text-error mt-1">{postalError}</p>
                )}
                {!postalError && (
                  <p className="text-xs text-on-surface-variant mt-1">Enter a 6-digit postal code to auto-fill your address.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                    Block
                  </label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                    Unit Number
                  </label>
                  <input
                    type="text"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-sm font-headline font-semibold text-on-surface-variant mb-1.5">
                  Building Name <span className="text-on-surface-variant/60 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={addressSaving}
                  className="vitality-gradient text-on-primary px-8 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {addressSaving ? "Saving..." : "Update Address"}
                </button>
                {addressSuccess && (
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Saved
                  </span>
                )}
              </div>
            </div>

          </section>
        )}

        {activeTab === "purchases" && (
          <section>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container">
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Order ID</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Date</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Protocol</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Amount</th>
                    <th className="text-left px-6 py-4 font-headline font-bold text-sm text-on-surface">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPurchases.map((order) => (
                    <tr key={order.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-body text-sm text-primary font-semibold cursor-pointer hover:underline" onClick={() => setSelectedOrder(order)}>{order.id}</td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">{order.date}</td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface">{order.stack}</td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface font-semibold">${order.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-headline font-bold text-on-primary-fixed">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mockPurchases.length === 0 && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">shopping_bag</span>
                <p className="text-on-surface-variant font-headline font-semibold">No purchases yet.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "notes" && (
          <section className="space-y-6">
            {mockNotes.map((note) => (
              <div
                key={note.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">stethoscope</span>
                    <span className="font-headline font-bold text-on-surface">{note.doctor}</span>
                  </div>
                  <span className="text-sm text-on-surface-variant font-body">{note.date}</span>
                </div>
                <p className="font-body text-on-surface-variant leading-relaxed">{note.summary}</p>
              </div>
            ))}

            {mockNotes.length === 0 && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">clinical_notes</span>
                <p className="text-on-surface-variant font-headline font-semibold">No doctor notes on file.</p>
              </div>
            )}
          </section>
        )}

        {/* Logout */}
        <div className="mt-16 pt-8 border-t border-outline-variant">
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex items-center gap-2 rounded-xl border border-error px-6 py-3 font-headline font-bold text-sm text-error hover:bg-error hover:text-on-error transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Sign Out
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
