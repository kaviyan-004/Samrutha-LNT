import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F6F9' }}>
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#003366' }}>
                        <Activity size={20} color="white" />
                    </div>
                    <span className="font-heading font-bold text-slate-800 text-xl">EffortIQ</span>
                </div>
                <div className="text-8xl font-heading font-bold mb-4" style={{ color: '#003366' }}>404</div>
                <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">Page Not Found</h2>
                <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
                    The page you are looking for doesn't exist or you don't have access.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 rounded-xl text-white text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #003366, #1E4DB7)' }}
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}
