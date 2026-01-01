"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { ChevronRight, Flag, User as UserIcon, Bookmark, Ticket, Lock, MessageCircle, HelpCircle, FileText, UserX, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  user: User;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ user }) => {
  const router = useRouter();

  const profileMenuItems = [
    {
      icon: Flag,
      title: "Current country: ID",
      subtitle: null,
      onClick: () => { },
    },
    {
      icon: UserIcon,
      title: "Edit profile",
      subtitle: "Edit your contact details",
      onClick: () => router.push("/profile/edit"),
    },
    {
      icon: Bookmark,
      title: "My favorites",
      subtitle: null,
      onClick: () => router.push("/favorites"),
    },
    {
      icon: Star,
      title: "Review Saya",
      subtitle: "Lihat review yang Anda terima",
      onClick: () => router.push("/profile/reviews"),
    },
    {
      icon: Ticket,
      title: "Vouchers",
      subtitle: "Vouchers and account balance",
      onClick: () => router.push("/profile/vouchers"),
    },
    {
      icon: Lock,
      title: "Sign out",
      subtitle: null,
      onClick: () => signOut(),
    },
  ];

  const helpMenuItems = [
    {
      icon: MessageCircle,
      title: "Start chat",
      subtitle: "Contact RENLE",
      onClick: () => { },
    },
    {
      icon: HelpCircle,
      title: "Frequently asked questions",
      subtitle: "Here you will find information about most things about RENLE and our services.",
      onClick: () => router.push("/profile/faq"),
    },
    {
      icon: FileText,
      title: "Read our terms and conditions",
      subtitle: "Terms and Conditions",
      onClick: () => router.push("/profile/terms"),
    },
    {
      icon: UserX,
      title: "Delete account",
      subtitle: null,
      onClick: () => router.push("/profile/delete"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pt-[80px]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Profil Saya</h1>

        {/* Profile Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm dark:shadow-neutral-950/50 mb-6">
          {profileMenuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
              {index < profileMenuItems.length - 1 && (
                <div className="border-b border-gray-100 dark:border-neutral-700 mx-6" />
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bantuan</h2>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm dark:shadow-neutral-950/50">
          {helpMenuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
              {index < helpMenuItems.length - 1 && (
                <div className="border-b border-gray-100 dark:border-neutral-700 mx-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
