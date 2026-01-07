import {
  Users,
  ClipboardList,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getDashboardStats } from '@/lib/google/sheets';

export const dynamic = 'force-dynamic';

const IconMap = {
  Users,
  ClipboardList,
  CheckCircle,
  AlertCircle
};

export default async function Home() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">नमस्कार, प्रशासक 👋</h1>
        <p className="text-gray-500 mt-2 text-lg">ग्राम महसूल अधिकारी दप्तर तपासणी प्रणालीमध्ये आपले स्वागत आहे.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = IconMap[stat.icon as keyof typeof IconMap];
          return (
            <div key={stat.label} className="premium-card p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of the page remains the same for now, or can be made dynamic later */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="premium-card p-8">
          <h2 className="text-xl font-bold mb-6">अलीकडील क्रियाकलाप</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">तपासणी प्रणाली अपडेट झाली</p>
                  <p className="text-sm text-gray-500 mt-1">सर्व डेटा गुगल शीटमधून प्राप्त होत आहे.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="premium-card p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <h2 className="text-xl font-bold mb-4">जलद दुवे (Quick Links)</h2>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-semibold flex flex-col items-center gap-2">
              <ClipboardList size={20} />
              नवीन प्रश्न जोडा
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-semibold flex flex-col items-center gap-2">
              <Users size={20} />
              अधिकारी व्यवस्थापन
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-semibold flex flex-col items-center gap-2">
              <CheckCircle size={20} />
              अहवाल डाउनलोड करा
            </button>
            <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-semibold flex flex-col items-center gap-2">
              <AlertCircle size={20} />
              त्रुटी पहा
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
