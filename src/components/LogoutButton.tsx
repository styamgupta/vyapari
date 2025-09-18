"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1 rounded"
    >
      🚪 Logout
    </button>
  );
}
