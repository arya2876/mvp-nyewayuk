"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { ChevronRight, Flag, User as UserIcon, Bookmark, Ticket, Lock, MessageCircle, HelpCircle, FileText, UserX, Paintbrush } from "lucide-react";
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
      onClick: () => {},
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
      subtitle: "Contact NyewaYuk",
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      title: "Frequently asked questions",
      subtitle: "Here you will find information about most things about NyewaYuk and our services.",
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

  const betaMenuItems = [
    {
      icon: Paintbrush,
      title: "Appearance: Light",
      subtitle: "To change appearance you need to restart the application",
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My profile</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          {profileMenuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 text-gray-700" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              {index < profileMenuItems.length - 1 && (
                <div className="border-b border-gray-100 mx-6" />
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Help</h2>
        <div className="bg-white rounded-xl shadow-sm mb-6">
          {helpMenuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 text-gray-700" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              {index < helpMenuItems.length - 1 && (
                <div className="border-b border-gray-100 mx-6" />
              )}
            </div>
          ))}
        </div>

        {/* Beta Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Beta</h2>
        <div className="bg-white rounded-xl shadow-sm">
          {betaMenuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-6 h-6 text-gray-700" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
