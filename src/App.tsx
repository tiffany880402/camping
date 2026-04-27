import React, { useEffect, useState, ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, ChangeEvent } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Package, 
  BarChart2, 
  User, 
  Settings, 
  Plus, 
  MapPin, 
  Calendar, 
  Compass,
  GripVertical,
  TrendingUp,
  Landmark,
  Utensils,
  ShoppingBag,
  ArrowLeft,
  Camera,
  Star,
  Trash2,
  CheckCircle2,
  Circle,
  Edit2,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn, formatCurrency } from './lib/utils';
import { MOCK_TRIPS } from './constants';
import { CampingTrip, GearItem } from './types';

// --- Components ---

const BackgroundMesh = () => (
  <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
    <div className="mesh-gradient-1" />
    <div className="mesh-gradient-2" />
    <div className="mesh-gradient-3" />
  </div>
);

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'record', icon: Calendar, label: '記錄', path: '/' },
    { id: 'gear', icon: Package, label: '裝備', path: '/gear' },
    { id: 'stats', icon: BarChart2, label: '統計', path: '/stats' },
    { id: 'settings', icon: User, label: '個人', path: '/settings' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-4">
      <nav className="max-w-xs mx-auto glass rounded-full shadow-2xl p-1.5 flex justify-between items-center bg-white/80 border-white/40">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "relative flex-1 flex flex-col items-center gap-1 py-2.5 transition-all outline-none",
                isActive ? "text-stone-800" : "text-stone-400"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activePill"
                  className="absolute inset-0 bg-morandi-100/60 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon size={20} className={isActive ? "text-morandi-600" : "text-stone-500"} />
              <span className={cn("text-[9px] font-bold tracking-wider", isActive ? "text-stone-800" : "text-stone-600")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// --- Pages ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/70 backdrop-blur-[8px]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-[20px] sm:rounded-[20px] p-4 sm:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            <div className="w-12 h-1 bg-stone-100 rounded-full mb-6 mx-auto sm:hidden" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-stone-900 tracking-tight leading-none mb-1.5 font-sans">{title}</h2>
                <div className="w-8 h-1 bg-morandi-500 rounded-full" />
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition-all active:scale-90"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar pb-2">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FormField = ({ label, children, icon: Icon }: { label: string, children: ReactNode, icon?: any }) => (
  <div className="space-y-1.5 mb-5 last:mb-0">
    <div className="flex items-center gap-1.5 px-0.5">
      {Icon && <Icon size={10} className="text-stone-400" />}
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">{label}</label>
    </div>
    <div className="relative group">
      {children}
    </div>
  </div>
);

const FormInput = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className={cn(
      "w-full px-4 py-3 bg-stone-50/50 rounded-[20px] border-2 border-transparent focus:border-morandi-500/20 focus:bg-white outline-none transition-all font-bold text-stone-700 text-sm placeholder:text-stone-300 placeholder:font-medium",
      className
    )}
  />
);

const FormTextarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    {...props} 
    className={cn(
      "w-full px-4 py-3 bg-stone-50/50 rounded-[20px] border-2 border-transparent focus:border-morandi-500/20 focus:bg-white outline-none transition-all font-bold text-stone-700 text-sm placeholder:text-stone-300 placeholder:font-medium min-h-[100px] resize-none",
      className
    )}
  />
);

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[20px] p-6 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
            <Trash2 size={24} />
          </div>
          <h3 className="text-xl font-black text-stone-900 mb-2">{title}</h3>
          <p className="text-sm text-stone-500 font-medium mb-8 leading-relaxed">{message}</p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-[20px] font-black text-xs tracking-widest uppercase hover:bg-stone-200 transition-colors"
            >
              取消
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3 bg-red-500 text-white rounded-[20px] font-black text-xs tracking-widest uppercase shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
            >
              確定刪除
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const DEFAULT_GEAR_LIST = [
  { id: 'dg1', name: '帳篷', assignee: '我', isCompleted: false },
  { id: 'dg2', name: '地墊', assignee: '我', isCompleted: false },
  { id: 'dg3', name: '營柱', assignee: '我', isCompleted: false },
  { id: 'dg4', name: '營釘', assignee: '我', isCompleted: false },
  { id: 'dg5', name: '睡袋', assignee: '我', isCompleted: false },
  { id: 'dg6', name: '床墊', assignee: '我', isCompleted: false },
  { id: 'dg7', name: '枕頭', assignee: '我', isCompleted: false },
  { id: 'dg8', name: '毯子', assignee: '我', isCompleted: false },
  { id: 'dg9', name: '打氣機', assignee: '我', isCompleted: false },
  { id: 'dg10', name: '小地墊', assignee: '我', isCompleted: false },
  { id: 'dg11', name: '野餐墊', assignee: '我', isCompleted: false },
  { id: 'dg12', name: '繩子', assignee: '我', isCompleted: false },
  { id: 'dg13', name: '鉤子', assignee: '我', isCompleted: false },
  { id: 'dg14', name: '晾衣繩', assignee: '我', isCompleted: false },
  { id: 'dg15', name: '衣架', assignee: '我', isCompleted: false },
  { id: 'dg16', name: '沙發', assignee: '我', isCompleted: false },
  { id: 'dg17', name: '露營桌 (IGT)', assignee: '我', isCompleted: false },
  { id: 'dg18', name: '露營椅', assignee: '我', isCompleted: false },
  { id: 'dg19', name: '小桌子', assignee: '我', isCompleted: false },
  { id: 'dg20', name: '鐵架', assignee: '我', isCompleted: false },
  { id: 'dg21', name: '水桶架子', assignee: '我', isCompleted: false },
  { id: 'dg22', name: '新架子', assignee: '我', isCompleted: false },
  { id: 'dg23', name: 'THOR垃圾桶', assignee: '我', isCompleted: false },
  { id: 'dg24', name: '大蝸牛', assignee: '我', isCompleted: false },
  { id: 'dg25', name: '垃圾袋', assignee: '我', isCompleted: false },
  { id: 'dg26', name: '黑色垃圾袋', assignee: '我', isCompleted: false },
  { id: 'dg27', name: '碗', assignee: '我', isCompleted: false },
  { id: 'dg28', name: '水杯', assignee: '我', isCompleted: false },
  { id: 'dg29', name: '餐具', assignee: '我', isCompleted: false },
  { id: 'dg30', name: '餐盤', assignee: '我', isCompleted: false },
  { id: 'dg31', name: '鍋子', assignee: '我', isCompleted: false },
  { id: 'dg32', name: '煮飯工具組', assignee: '我', isCompleted: false },
  { id: 'dg33', name: '卡式爐', assignee: '我', isCompleted: false },
  { id: 'dg34', name: '瓦斯罐', assignee: '我', isCompleted: false },
  { id: 'dg35', name: '防風片', assignee: '我', isCompleted: false },
  { id: 'dg36', name: '電鍋', assignee: '我', isCompleted: false },
  { id: 'dg37', name: '調味料', assignee: '我', isCompleted: false },
  { id: 'dg38', name: '咖啡包', assignee: '我', isCompleted: false },
  { id: 'dg39', name: '茶包', assignee: '我', isCompleted: false },
  { id: 'dg40', name: '桶水', assignee: '我', isCompleted: false },
  { id: 'dg41', name: '瑞士刀', assignee: '我', isCompleted: false },
  { id: 'dg42', name: '晾碗架', assignee: '我', isCompleted: false },
  { id: 'dg43', name: '保鮮膜', assignee: '我', isCompleted: false },
  { id: 'dg44', name: '餐巾紙', assignee: '我', isCompleted: false },
  { id: 'dg45', name: '氣氛燈', assignee: '我', isCompleted: false },
  { id: 'dg46', name: '夾子', assignee: '我', isCompleted: false },
  { id: 'dg47', name: '卡式燈', assignee: '我', isCompleted: false },
  { id: 'dg48', name: '插電燈', assignee: '我', isCompleted: false },
  { id: 'dg49', name: '白色立燈', assignee: '我', isCompleted: false },
  { id: 'dg50', name: '延長線', assignee: '我', isCompleted: false },
  { id: 'dg51', name: '行動電源', assignee: '我', isCompleted: false },
  { id: 'dg52', name: '喇叭', assignee: '我', isCompleted: false },
  { id: 'dg53', name: '相機', assignee: '我', isCompleted: false },
  { id: 'dg54', name: '平板', assignee: '我', isCompleted: false },
  { id: 'dg55', name: 'Switch', assignee: '我', isCompleted: false },
  { id: 'dg56', name: '衣服', assignee: '我', isCompleted: false },
  { id: 'dg57', name: '褲子', assignee: '我', isCompleted: false },
  { id: 'dg58', name: '睡衣', assignee: '我', isCompleted: false },
  { id: 'dg59', name: '拖鞋', assignee: '我', isCompleted: false },
  { id: 'dg60', name: '毛巾', assignee: '我', isCompleted: false },
  { id: 'dg61', name: '衛生紙', assignee: '我', isCompleted: false },
  { id: 'dg62', name: '乾洗髮', assignee: '我', isCompleted: false },
  { id: 'dg63', name: '洗髮精', assignee: '我', isCompleted: false },
  { id: 'dg64', name: '沐浴乳', assignee: '我', isCompleted: false },
  { id: 'dg65', name: '防蚊液', assignee: '我', isCompleted: false },
  { id: 'dg66', name: '蚊香', assignee: '我', isCompleted: false },
  { id: 'dg67', name: '打火機', assignee: '我', isCompleted: false },
  { id: 'dg68', name: '防曬', assignee: '我', isCompleted: false },
  { id: 'dg69', name: '露營小旗子', assignee: '我', isCompleted: false },
];

const DashboardPage = ({ trips, onAddTrip, onDeleteTrip }: { trips: CampingTrip[], onAddTrip: (trip: CampingTrip) => void, onDeleteTrip: (id: string) => void }) => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedPros, setSelectedPros] = useState<string[]>([]);
  const [selectedCons, setSelectedCons] = useState<string[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    budget: '',
    weather: '',
    campType: '',
    facilities: [] as string[],
    pitchArea: '',
    rating: 5,
    notes: ''
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const togglePro = (option: string) => {
    setSelectedPros(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const toggleCon = (option: string) => {
    setSelectedCons(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('請輸入主題與營區名稱');
      return;
    }

    setIsSaving(true);
    
    try {
      const newTrip: CampingTrip = {
        id: Date.now().toString(),
        name: formData.name,
        date: formData.date || new Date().toISOString().split('T')[0],
        location: {
          name: formData.location || '未知亮點',
          city: formData.location ? formData.location.split(' ')[0] : '台灣'
        },
        photos: photo ? [photo] : ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1000'],
        expenses: [
          { id: 'initial_' + Date.now(), name: '營地費', amount: Number(formData.budget) || 0 }
        ],
        notes: formData.notes,
        rating: formData.rating,
        weather: formData.weather || '晴朗',
        campType: formData.campType,
        facilities: formData.facilities,
        pitchArea: formData.pitchArea,
        pros: selectedPros,
        cons: selectedCons,
        gearList: DEFAULT_GEAR_LIST.map(g => ({ ...g, id: 'dg_' + Date.now() + Math.random() })),
        shoppingList: []
      };

      onAddTrip(newTrip);
      
      setIsAddModalOpen(false);
      // Reset form
      setFormData({ 
        name: '', 
        date: '', 
        location: '', 
        budget: '', 
        weather: '', 
        campType: '', 
        facilities: [], 
        pitchArea: '', 
        rating: 5, 
        notes: '' 
      });
      setPhoto(null);
      setSelectedPros([]);
      setSelectedCons([]);
    } catch (error) {
      console.error('Save failed:', error);
      alert('儲存失敗，請重試');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-32 pt-12 px-4">
      <div className="mb-6 px-2">
        <h1 className="text-2xl font-black text-stone-800 tracking-tight">露營日誌</h1>
        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Adventure Log & Gear</p>
      </div>
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="w-10 h-10 bg-morandi-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-morandi-600/20">
          <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2 glass bg-white rounded-full text-xs font-black text-morandi-700 shadow-sm border border-morandi-100 flex items-center gap-1 active:scale-95 transition-transform"
        >
          <Plus size={14} /> 新增活動
        </button>
      </div>

      <div className="space-y-8">
        {trips.map((trip, idx) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="relative overflow-hidden rounded-[20px] glass card-shadow cursor-pointer group hover:shadow-morandi-200/40 transition-all border border-white/60"
          >
            <div className="aspect-[16/9] relative overflow-hidden">
              <img 
                src={trip.photos[0]} 
                alt={trip.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 glass px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-extrabold tracking-widest">
                {trip.date}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(trip.id);
                }}
                className="absolute top-4 right-4 w-8 h-8 glass bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <div className="absolute bottom-5 left-4 text-white">
                <h3 className="text-2xl font-black tracking-tight leading-none">{trip.name}</h3>
                <div className="flex items-center gap-1.5 opacity-80 mt-2">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">{trip.location.city} · {trip.location.name}</span>
                </div>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center bg-white/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-morandi-50 flex items-center justify-center">
                   <Landmark size={18} className="text-morandi-600" />
                </div>
                <div>
                   <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest">總支出</p>
                   <p className="text-sm font-black text-stone-800">{formatCurrency(trip.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="建立新探索">
        <div className="space-y-5">
          <FormField label="主題與營區" icon={Compass}>
            <FormInput 
              placeholder="例如：武陵農場冬季雪景..." 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>

          <FormField label="活動照片" icon={Camera}>
            <div className="relative group overflow-hidden rounded-[20px] bg-stone-50 border-2 border-dashed border-stone-200 aspect-[16/9] flex flex-col items-center justify-center transition-all hover:border-morandi-300 hover:bg-morandi-50/10">
              {photo ? (
                <>
                  <img src={photo} alt="Upload preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setPhoto(null)}
                      className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Plus size={20} className="rotate-45" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Camera size={32} className="text-stone-300 mb-2" />
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">點擊或拖曳上傳照片</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </FormField>
          
          <FormField label="出發日期" icon={Calendar}>
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-morandi-400 group-focus-within/input:text-morandi-600 transition-colors pointer-events-none">
                <Calendar size={18} />
              </div>
              <FormInput 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-12 bg-stone-50/50 border-stone-100 focus:bg-white focus:border-morandi-300 h-14"
              />
            </div>
          </FormField>
          
          <FormField label="所在地點">
            <FormInput 
              placeholder="例如：新竹 尖石" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </FormField>

          <FormField label="搭帳區域">
            <FormInput 
              placeholder="例如：森林區 A3..." 
              value={formData.pitchArea}
              onChange={(e) => setFormData({ ...formData, pitchArea: e.target.value })}
            />
          </FormField>

          <FormField label="營地預算">
            <FormInput 
              type="number" 
              placeholder="$1,200" 
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </FormField>

          <FormField label="天氣狀況">
            <div className="flex flex-wrap gap-2">
              {['晴朗', '多雲', '有雨', '寒冷'].map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setFormData({ ...formData, weather: w })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    formData.weather === w ? "bg-morandi-600 border-morandi-600 text-white shadow-lg" : "bg-white border-stone-100 text-stone-500"
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="營地類型">
            <div className="flex flex-wrap gap-2">
              {['碎石', '混和', '草皮', '棧板'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, campType: t })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    formData.campType === t ? "bg-morandi-600 border-morandi-600 text-white shadow-lg" : "bg-white border-stone-100 text-stone-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="設備選項">
            <div className="flex flex-wrap gap-2">
              {['飲水機', '冰箱', '插座', '沐浴洗髮乳', '吹風機'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    const next = formData.facilities.includes(f) 
                      ? formData.facilities.filter(i => i !== f)
                      : [...formData.facilities, f];
                    setFormData({ ...formData, facilities: next });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    formData.facilities.includes(f) ? "bg-morandi-600 border-morandi-600 text-white shadow-lg" : "bg-white border-stone-100 text-stone-500"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="總體評價">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                    formData.rating >= star ? "bg-yellow-50 border-yellow-100 text-yellow-500 shadow-sm" : "bg-white border-stone-100 text-stone-200"
                  )}
                >
                  <Star size={18} fill={formData.rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="優點評價">
            <div className="flex flex-wrap gap-2">
              {['草地平整', '衛浴乾淨', '熱水充足', '景觀超美', '路況良好', '高度隱私', '星空燦爛', '清靜悠閒', '遮蔭豐富', '營主熱情', '交通便利', '營位寬敞'].map(option => (
                <button 
                  key={option}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePro(option);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full border text-[10px] font-black transition-all group",
                    selectedPros.includes(option) 
                      ? "border-morandi-500 bg-morandi-50 text-morandi-700 shadow-sm" 
                      : "border-stone-200 bg-stone-50 text-stone-400 hover:border-morandi-200"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="缺點留意">
             <div className="flex flex-wrap gap-2">
              {['無!', '人太多', '熱水不穩', '浴廁少', '山路陡', '難搭帳', '泥濘', '很曬', '風大', '有蟑螂', '蒼蠅多', '蚊蟲多'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCon(option);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full border text-[10px] font-black transition-all group",
                    selectedCons.includes(option) 
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm" 
                      : "border-stone-200 bg-stone-50 text-stone-400 hover:border-orange-200"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="探險日誌">
            <FormTextarea 
              placeholder="記下這次與自然對話的點點滴滴..." 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormField>

          <div className="pt-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 bg-morandi-600 text-white rounded-[12px] font-black shadow-lg shadow-morandi-600/20 active:scale-[0.98] transition-all hover:bg-morandi-700 text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '正在儲存...' : '儲存紀錄'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && onDeleteTrip(deleteId)}
        title="刪除這場冒險？"
        message="這將會永久移除此筆露營紀錄，所有照片與裝備清單都將消失。"
      />
    </div>
  );
};

const TripDetailPage = ({ trips, onUpdateTrip, onDeleteTrip }: { trips: CampingTrip[], onUpdateTrip: (trip: CampingTrip) => void, onDeleteTrip: (id: string) => void }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialTrip = trips.find(t => t.id === id) || trips[0];
  const [trip, setTrip] = useState<CampingTrip>(initialTrip);
  const [activeTab, setActiveTab] = useState<'campus' | 'gear' | 'shopping'>('campus');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPros, setSelectedPros] = useState<string[]>(trip.pros || []);
  const [selectedCons, setSelectedCons] = useState<string[]>(trip.cons || []);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState({ name: '', amount: '' });
  const [gearForm, setGearForm] = useState({ name: '', assignee: '' });
  const [shoppingForm, setShoppingForm] = useState({ name: '', buyer: '', category: '' });

  const [editData, setEditData] = useState({
    name: trip.name,
    city: trip.location.city,
    date: trip.date,
    weather: trip.weather || '晴朗',
    campType: trip.campType || '草皮',
    facilities: trip.facilities || [],
    pitchArea: trip.pitchArea || '',
    rating: trip.rating || 5,
    notes: trip.notes,
    photos: trip.photos || []
  });

  const togglePro = (option: string) => {
    setSelectedPros(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const toggleCon = (option: string) => {
    setSelectedCons(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const handleUpdate = () => {
    const updatedTrip: CampingTrip = {
      ...trip,
      name: editData.name,
      date: editData.date,
      location: {
        ...trip.location,
        city: editData.city
      },
      weather: editData.weather,
      campType: editData.campType,
      facilities: editData.facilities,
      pitchArea: editData.pitchArea,
      rating: editData.rating,
      notes: editData.notes,
      photos: editData.photos,
      pros: selectedPros,
      cons: selectedCons
    };

    onUpdateTrip(updatedTrip);
    setTrip(updatedTrip);
    setIsEditModalOpen(false);
  };

  const updateAndSync = (newTrip: CampingTrip) => {
    onUpdateTrip(newTrip);
    setTrip(newTrip);
  };

  const addExpense = () => {
    if (!expenseForm.name || !expenseForm.amount) return;
    const newItem = { id: Date.now().toString(), name: expenseForm.name, amount: Number(expenseForm.amount) };
    const updatedTrip = { ...trip, expenses: [...(trip.expenses || []), newItem] };
    updateAndSync(updatedTrip);
    setExpenseForm({ name: '', amount: '' });
    setIsExpenseModalOpen(false);
  };

  const deleteExpense = (id: string) => {
    const updatedTrip = { ...trip, expenses: trip.expenses.filter(e => e.id !== id) };
    updateAndSync(updatedTrip);
  };

  const [editingGearId, setEditingGearId] = useState<string | null>(null);

  const addGear = () => {
    if (!gearForm.name) return;
    if (editingGearId) {
      const updatedTrip = {
        ...trip,
        gearList: trip.gearList?.map(g => g.id === editingGearId ? { ...g, name: gearForm.name, assignee: gearForm.assignee } : g)
      };
      updateAndSync(updatedTrip);
      setEditingGearId(null);
    } else {
      const newItem = { id: Date.now().toString(), name: gearForm.name, assignee: gearForm.assignee, isCompleted: false };
      const updatedTrip = { ...trip, gearList: [...(trip.gearList || []), newItem] };
      updateAndSync(updatedTrip);
    }
    setGearForm({ name: '', assignee: '' });
    setIsGearModalOpen(false);
  };

  const startEditGear = (item: GearItem) => {
    setGearForm({ name: item.name, assignee: item.assignee });
    setEditingGearId(item.id);
    setIsGearModalOpen(true);
  };

  const toggleGear = (id: string) => {
    const updatedTrip = { 
      ...trip, 
      gearList: trip.gearList?.map(g => g.id === id ? { ...g, isCompleted: !g.isCompleted } : g) 
    };
    updateAndSync(updatedTrip);
  };

  const deleteGear = (id: string) => {
    const updatedTrip = { ...trip, gearList: trip.gearList?.filter(g => g.id !== id) };
    updateAndSync(updatedTrip);
  };

  const addShopping = () => {
    if (!shoppingForm.name) return;
    const newItem = { 
      id: Date.now().toString(), 
      name: shoppingForm.name, 
      buyer: shoppingForm.buyer, 
      category: shoppingForm.category || '未分類', 
      isPurchased: false 
    };
    const updatedTrip = { ...trip, shoppingList: [...(trip.shoppingList || []), newItem] };
    updateAndSync(updatedTrip);
    setShoppingForm({ name: '', buyer: '', category: '' });
    setIsShoppingModalOpen(false);
  };

  const toggleShopping = (id: string) => {
    const updatedTrip = { 
      ...trip, 
      shoppingList: trip.shoppingList?.map(s => s.id === id ? { ...s, isPurchased: !s.isPurchased } : s) 
    };
    updateAndSync(updatedTrip);
  };

  const deleteShopping = (id: string) => {
    const updatedTrip = { ...trip, shoppingList: trip.shoppingList?.filter(s => s.id !== id) };
    updateAndSync(updatedTrip);
  };

  const totalExpenses = trip.expenses?.reduce((sum, item) => sum + item.amount, 0) || 0;

  const tabs = [
    { id: 'campus', label: '內容' },
    { id: 'gear', label: '裝備' },
    { id: 'shopping', label: '購物' }
  ];

  return (
    <div className="pb-32 bg-white min-h-screen">
      <div className="relative h-80 overflow-hidden">
        <img 
          src={trip.photos[0]} 
          alt={trip.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 glass rounded-full flex items-center justify-center text-stone-800"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-red-500 shadow-xl border border-white"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-5 py-2 glass rounded-full text-xs font-black text-morandi-700 shadow-xl border border-white"
            >
              編輯行程
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />
      </div>

      <div className="px-4 -mt-12 relative z-10">
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-black text-morandi-600 tracking-widest uppercase">{trip.date}</span>
               <div className="flex gap-0.5">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} size={12} fill={i < trip.rating ? "#fef9c3" : "none"} color={i < trip.rating ? "#7c9482" : "#d1d5db"} />
                 ))}
               </div>
            </div>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight leading-tight">{trip.name}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-stone-500">
              <MapPin size={14} className="text-morandi-500" />
              <span className="text-sm font-black">{trip.location.city} · {trip.location.name}</span>
            </div>
        </div>

        <div className="flex gap-2 mb-8 glass p-1.5 rounded-[20px] bg-stone-100/40 border border-white">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex-1 py-3 text-[10px] font-black tracking-widest uppercase rounded-[20px] transition-all",
                 activeTab === tab.id ? "bg-morandi-600 text-white shadow-lg shadow-morandi-200/50 translate-y-[-1px]" : "text-stone-600"
               )}
             >
               {tab.label}
             </button>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'campus' && (
            <motion.div 
              key="campus"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
               <div className="px-0 grid grid-cols-2 gap-4">
                <div className="p-4 glass bg-white rounded-[20px] border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-morandi-50 rounded-[20px] flex items-center justify-center text-morandi-600 mb-3">
                    <Landmark size={20} />
                  </div>
                  <div className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mb-1">營地費用</div>
                  <div className="text-lg font-black text-stone-800">
                    {formatCurrency(trip.expenses?.find(e => e.name === '營地費' || e.name === '營地費用')?.amount || 0)}
                  </div>
                </div>
                <div className="p-4 glass bg-white rounded-[20px] border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-morandi-50 rounded-[20px] flex items-center justify-center text-morandi-600 mb-3">
                    <Compass size={20} />
                  </div>
                  <div className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mb-1">天氣環境</div>
                  <div className="text-lg font-black text-stone-800">{trip.weather}</div>
                </div>
              </div>

              <div className="px-0 grid grid-cols-2 gap-4">
                <div className="p-4 glass bg-white rounded-[20px] border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-morandi-50 rounded-[20px] flex items-center justify-center text-morandi-600 mb-3">
                    <Settings size={20} />
                  </div>
                  <div className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mb-1">營地類型</div>
                  <div className="text-lg font-black text-stone-800">{trip.campType || '未標註'}</div>
                </div>
                <div className="p-4 glass bg-white rounded-[20px] border border-stone-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-morandi-50 rounded-[20px] flex items-center justify-center text-morandi-600 mb-3">
                    <MapPin size={20} />
                  </div>
                  <div className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mb-1">搭帳區域</div>
                  <div className="text-lg font-black text-stone-800 truncate w-full px-2" title={trip.pitchArea}>{trip.pitchArea || '未填寫'}</div>
                </div>
              </div>

              {trip.facilities && trip.facilities.length > 0 && (
                <div className="p-4 glass bg-stone-50 border-stone-100/50 rounded-[20px] border">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3 flex items-center gap-1.5">
                    <Star size={10} className="text-morandi-400" /> 提供設備
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {trip.facilities.map((f, i) => (
                       <span key={i} className="px-3 py-1 bg-white text-[10px] font-bold text-stone-600 rounded-full border border-stone-100 shadow-sm">{f}</span>
                     ))}
                  </div>
                </div>
              )}

              {/* Pros & Cons Section */}
              <div className="space-y-4">
                <div className="p-4 glass bg-white border-morandi-100 rounded-[20px] border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-morandi-500 rounded-[20px] flex items-center justify-center text-white text-[10px]">👍</div>
                      <h4 className="text-[10px] font-black text-morandi-600 uppercase tracking-[0.2em] mt-0.5">優點記敘</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {trip.pros?.map((p, i) => (
                        <span key={i} className="px-3 py-1.5 bg-yellow-light/50 text-[10px] font-bold text-morandi-800 rounded-full border border-yellow-light"># {p}</span>
                      )) || <span className="text-xs text-stone-300 italic">暫無紀錄</span>}
                  </div>
                </div>
                <div className="p-4 glass bg-white border-orange-100 rounded-[20px] border border-white shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-orange-500 rounded-[20px] flex items-center justify-center text-white text-[10px]">👎</div>
                      <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mt-0.5">需要留意</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {trip.cons?.map((c, i) => (
                        <span key={i} className="px-3 py-1.5 bg-orange-50 text-[10px] font-bold text-orange-700 rounded-full border border-orange-100"># {c}</span>
                      )) || <span className="text-xs text-stone-300 italic">暫無紀錄</span>}
                  </div>
                </div>
              </div>

              {/* Expenses Section */}
              <div className="space-y-8">
                <div className="p-4 bg-white rounded-[20px] border border-stone-100 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-morandi-50 rounded-[20px] flex items-center justify-center text-morandi-600">
                        <Landmark size={24} />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-black text-stone-300 tracking-[0.2em] mb-1">費用總覽 / EXPENSES</div>
                        <div className="text-2xl font-black text-stone-800 tracking-tight">{formatCurrency(totalExpenses)}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsExpenseModalOpen(true)}
                      className="w-12 h-12 bg-stone-50 text-morandi-600 rounded-[20px] flex items-center justify-center hover:bg-morandi-50 transition-all active:scale-90"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {trip.expenses && trip.expenses.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {trip.expenses.map(item => (
                        <div key={item.id} className="relative overflow-hidden rounded-[20px]">
                          <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center bg-red-500 rounded-[20px]">
                            <Trash2 size={16} className="text-white" />
                          </div>
                          <motion.div
                            drag="x"
                            dragConstraints={{ left: -80, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={(_, info) => {
                              if (info.offset.x < -60) {
                                deleteExpense(item.id);
                              }
                            }}
                            className="relative bg-stone-50 p-4 rounded-[20px] flex justify-between items-center border border-stone-100/50 touch-pan-y"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-morandi-400" />
                              <span className="text-xs font-black text-stone-700">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-black text-stone-400">{formatCurrency(item.amount)}</span>
                              <div className="text-stone-300">
                                <GripVertical size={14} />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!trip.expenses?.length && (
                    <div className="text-center py-4 text-stone-200 font-bold text-[10px] uppercase tracking-widest italic opacity-50">
                      尚未新增費用項
                    </div>
                  )}
                </div>
              </div>

              <div className="pb-8">
                <div className="p-4 bg-stone-100/80 rounded-[20px] text-stone-800 shadow-sm relative overflow-hidden border border-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-morandi-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-morandi-600 mb-4 font-mono tracking-widest">探險日誌 / ADVENTURE LOG</h4>
                    <p className="text-sm leading-8 font-medium italic opacity-90 relative z-10 text-stone-600">
                        「{trip.notes}」
                    </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gear' && (
            <motion.div 
              key="gear"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center px-1">
                 <div className="flex flex-col">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">裝備清單</h4>
                   <span className="text-[9px] text-stone-300 font-bold mt-0.5">勾選標記已備妥物品</span>
                 </div>
                 <button 
                  onClick={() => setIsGearModalOpen(true)}
                  className="w-10 h-10 bg-morandi-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-morandi-200/50 active:scale-90 transition-transform"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 pb-10">
                {trip.gearList?.map(item => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "group p-5 rounded-[20px] flex justify-between items-center transition-all border",
                      item.isCompleted ? "bg-stone-50 border-stone-100 opacity-60" : "bg-white border-stone-100 shadow-sm"
                    )}
                  >
                    <div className="flex gap-4 items-center flex-1">
                        <button 
                          onClick={() => toggleGear(item.id)}
                          className={cn(
                            "w-10 h-10 rounded-[20px] flex items-center justify-center transition-all", 
                            item.isCompleted ? "bg-stone-200 text-stone-400" : "bg-morandi-50 text-morandi-600 shadow-sm"
                          )}
                        >
                          {item.isCompleted ? <CheckCircle2 size={18} /> : <Package size={18} />}
                        </button>
                        <div onClick={() => toggleGear(item.id)} className="flex-1 cursor-pointer">
                            <div className="text-[9px] font-black uppercase tracking-widest mb-1 text-stone-300">{item.assignee || '未分配'}</div>
                            <div className={cn("text-xs font-black", item.isCompleted ? "text-stone-400 line-through" : "text-stone-800")}>{item.name}</div>
                        </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => startEditGear(item)}
                        className="w-8 h-8 flex items-center justify-center text-stone-200 hover:text-morandi-500 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteGear(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-stone-200 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {!trip.gearList?.length && (
                  <div className="text-center py-12 text-stone-300 font-bold text-xs uppercase tracking-widest italic opacity-50">暫無裝備項</div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div 
              key="shopping"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center px-1">
                 <div className="flex flex-col">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">行前購物品項</h4>
                   <span className="text-[9px] text-stone-300 font-bold mt-0.5">標記已購入的必需品</span>
                 </div>
                 <button 
                  onClick={() => setIsShoppingModalOpen(true)}
                  className="w-10 h-10 bg-morandi-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-morandi-200/50 active:scale-90 transition-transform"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 pb-10">
                 {trip.shoppingList?.map(item => (
                   <div 
                    key={item.id} 
                    className={cn(
                      "group p-5 rounded-[20px] flex justify-between items-center transition-all border",
                      item.isPurchased ? "bg-stone-50 border-stone-100 opacity-60" : "bg-white border-stone-100 shadow-sm"
                    )}
                  >
                    <div className="flex gap-4 items-center flex-1">
                        <button 
                           onClick={() => toggleShopping(item.id)}
                           className={cn(
                             "w-10 h-10 rounded-[20px] flex items-center justify-center transition-all", 
                             item.isPurchased ? "bg-stone-200 text-stone-400" : "bg-morandi-50 text-morandi-600 shadow-sm"
                           )}
                         >
                          {item.isPurchased ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} />}
                        </button>
                        <div onClick={() => toggleShopping(item.id)} className="flex-1 cursor-pointer">
                           <div className="text-[9px] font-black text-stone-300 uppercase tracking-widest mb-1">{item.category} · {item.buyer}</div>
                           <div className={cn("text-xs font-black text-stone-800", item.isPurchased && "line-through opacity-40")}>{item.name}</div>
                        </div>
                    </div>
                    <button 
                     onClick={() => deleteShopping(item.id)}
                     className="w-8 h-8 flex items-center justify-center text-stone-200 hover:text-red-400 transition-colors"
                    >
                     <Trash2 size={14} />
                    </button>
                  </div>
                 ))}
                 {!trip.shoppingList?.length && (
                  <div className="text-center py-12 text-stone-300 font-bold text-xs uppercase tracking-widest italic opacity-50">暫無購物品項</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="更新探索紀錄">
        <div className="space-y-5">
          <FormField label="主題與營區" icon={Compass}>
            <FormInput 
              value={editData.name} 
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="例如：森林露營初體驗"
            />
          </FormField>

          <FormField label="活動照片" icon={Camera}>
            <div className="relative group overflow-hidden rounded-[20px] bg-stone-50 border-2 border-dashed border-stone-200 aspect-[16/9] flex flex-col items-center justify-center transition-all hover:border-morandi-300 hover:bg-morandi-50/10">
              {editData.photos.length > 0 ? (
                <>
                  <img src={editData.photos[0]} alt="Upload preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setEditData({ ...editData, photos: [] })}
                      className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Plus size={20} className="rotate-45" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Camera size={32} className="text-stone-300 mb-2" />
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">點擊或拖曳更換照片</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditData({ ...editData, photos: [reader.result as string] });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </FormField>
          
          <FormField label="出發日期" icon={Calendar}>
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-morandi-400 group-focus-within/input:text-morandi-600 transition-colors pointer-events-none">
                <Calendar size={18} />
              </div>
              <FormInput 
                type="date" 
                value={editData.date} 
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                className="pl-12 bg-stone-50/50 border-stone-100 focus:bg-white focus:border-morandi-300 h-14"
              />
            </div>
          </FormField>
          
          <FormField label="所在地點" icon={MapPin}>
            <FormInput 
              value={editData.city} 
              onChange={(e) => setEditData({ ...editData, city: e.target.value })}
              placeholder="例如：南投 魚池"
            />
          </FormField>

          <FormField label="搭帳區域">
            <FormInput 
              value={editData.pitchArea} 
              onChange={(e) => setEditData({ ...editData, pitchArea: e.target.value })}
              placeholder="例如：森林區 A3..."
            />
          </FormField>

          <FormField label="天氣狀況">
            <div className="flex flex-wrap gap-2">
              {['晴朗', '多雲', '有雨', '寒冷'].map(w => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setEditData({ ...editData, weather: w })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    editData.weather === w ? "bg-morandi-600 border-morandi-600 text-white shadow-lg" : "bg-white border-stone-100 text-stone-500"
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="營地類型">
            <div className="flex flex-wrap gap-2">
              {['碎石', '混和', '草皮', '棧板'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEditData({ ...editData, campType: t })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    editData.campType === t ? "bg-morandi-600 border-morandi-600 text-white shadow-lg" : "bg-white border-stone-100 text-stone-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="設備選項">
            <div className="flex flex-wrap gap-2">
              {['飲水機', '冰箱', '插座', '沐浴洗髮乳', '吹風機'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    const next = editData.facilities.includes(f) 
                      ? editData.facilities.filter(i => i !== f)
                      : [...editData.facilities, f];
                    setEditData({ ...editData, facilities: next });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    editData.facilities.includes(f) ? "bg-morandi-600 border-morandi-600 text-white shadow-lg" : "bg-white border-stone-100 text-stone-500"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="總體評價">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setEditData({ ...editData, rating: star })}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                    editData.rating >= star ? "bg-yellow-50 border-yellow-100 text-yellow-500 shadow-sm" : "bg-white border-stone-100 text-stone-200"
                  )}
                >
                  <Star size={18} fill={editData.rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="優點評價">
            <div className="flex flex-wrap gap-2">
              {['草地平整', '衛浴乾淨', '熱水充足', '景觀超美', '路況良好', '高度隱私', '星空燦爛', '清靜悠閒', '遮蔭豐富', '營主熱情', '交通便利', '營位寬敞'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    togglePro(option);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full border text-[10px] font-black transition-all group",
                    selectedPros.includes(option) 
                      ? "border-morandi-500 bg-morandi-50 text-morandi-700 shadow-sm" 
                      : "border-stone-200 bg-stone-50 text-stone-400 hover:border-morandi-200"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="缺點留意">
             <div className="flex flex-wrap gap-2">
              {['無!', '人太多', '熱水不穩', '浴廁少', '山路陡', '難搭帳', '泥濘', '很曬', '風大', '有蟑螂', '蒼蠅多', '蚊蟲多'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCon(option);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full border text-[10px] font-black transition-all group",
                    selectedCons.includes(option) 
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm" 
                      : "border-stone-200 bg-stone-50 text-stone-400 hover:border-orange-200"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="探險日誌">
            <FormTextarea 
              value={editData.notes} 
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              placeholder="記下這次與自然對話的點點滴滴..."
            />
          </FormField>

          <div className="pt-2">
            <button 
              onClick={handleUpdate}
              className="w-full py-2.5 bg-morandi-600 text-white rounded-[12px] font-black shadow-lg shadow-morandi-600/20 active:scale-[0.98] transition-all hover:bg-morandi-700 text-xs tracking-widest uppercase"
            >
              更新紀錄
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="新增費用項目">
        <div className="space-y-4">
          <FormField label="項目名稱">
            <FormInput 
              placeholder="例如：營地費、食材費..." 
              value={expenseForm.name}
              onChange={(e) => setExpenseForm({ ...expenseForm, name: e.target.value })}
            />
          </FormField>
          <FormField label="金額">
            <FormInput 
              type="number"
              placeholder="500" 
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
            />
          </FormField>
          <button 
            onClick={addExpense}
            className="w-full py-3 bg-morandi-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase"
          >
            加入費用
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={isGearModalOpen} 
        onClose={() => {
          setIsGearModalOpen(false);
          setEditingGearId(null);
          setGearForm({ name: '', assignee: '' });
        }} 
        title={editingGearId ? "編輯裝備項目" : "新增裝備項目"}
      >
        <div className="space-y-4">
          <FormField label="裝備名稱">
            <FormInput 
              placeholder="例如：天幕、摺疊椅..." 
              value={gearForm.name}
              onChange={(e) => setGearForm({ ...gearForm, name: e.target.value })}
            />
          </FormField>
          <FormField label="負責人">
            <FormInput 
              placeholder="例如：阿傑、小方..." 
              value={gearForm.assignee}
              onChange={(e) => setGearForm({ ...gearForm, assignee: e.target.value })}
            />
          </FormField>
          <button 
            onClick={addGear}
            className="w-full py-3 bg-morandi-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase"
          >
            {editingGearId ? "更新項目" : "加入裝備庫"}
          </button>
        </div>
      </Modal>

      <Modal isOpen={isShoppingModalOpen} onClose={() => setIsShoppingModalOpen(false)} title="新增購物品項">
        <div className="space-y-4">
          <FormField label="品項名稱">
            <FormInput 
              placeholder="例如：安格斯牛、黑咖啡..." 
              value={shoppingForm.name}
              onChange={(e) => setShoppingForm({ ...shoppingForm, name: e.target.value })}
            />
          </FormField>
          <FormField label="誰來採買">
            <FormInput 
              placeholder="例如：小明、大家平分..." 
              value={shoppingForm.buyer}
              onChange={(e) => setShoppingForm({ ...shoppingForm, buyer: e.target.value })}
            />
          </FormField>
          <FormField label="分類標記">
            <FormInput 
              placeholder="例如：食品、消耗品..." 
              value={shoppingForm.category}
              onChange={(e) => setShoppingForm({ ...shoppingForm, category: e.target.value })}
            />
          </FormField>
          <button 
            onClick={addShopping}
            className="w-full py-3 bg-morandi-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase"
          >
            加入購物清單
          </button>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          onDeleteTrip(trip.id);
          navigate('/');
        }}
        title="確認刪除紀錄？"
        message="刪除後將無法還原此筆活動內容，確定要繼續嗎？"
      />
    </div>
  );
};

const GearPage = ({ trips }: { trips: CampingTrip[] }) => {
  const navigate = useNavigate();
  const allGearCount = trips.reduce((acc, t) => acc + (t.gearList?.length || 0), 0);
  const completedGearCount = trips.reduce((acc, t) => acc + (t.gearList?.filter(g => g.isCompleted).length || 0), 0);

  return (
    <div className="pb-24 pt-10 px-4">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-stone-800">裝備管理</h1>
        <p className="text-stone-500 text-sm mt-1">按場次分類的戶外清單</p>
      </header>

      <div className="glass-dark rounded-[20px] p-4 py-3 mb-6 text-white shadow-2xl">
         <h3 className="text-[9px] font-bold uppercase tracking-widest text-morandi-400 mb-3 font-sans">裝備庫存摘要</h3>
         <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
              <span className="text-[10px] font-medium text-white/60">總清單項目</span>
              <span className="text-xs font-bold">{allGearCount} 件</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
              <span className="text-[10px] font-medium text-white/60">場次涵蓋</span>
              <span className="text-xs font-bold">{trips.length} 場</span>
            </div>
            <div className="pt-2 flex justify-between items-end">
               <div>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">裝備備點率</p>
                 <p className="text-2xl font-black text-white">{allGearCount > 0 ? Math.round((completedGearCount / allGearCount) * 100) : 0}%</p>
               </div>
               <div className="text-[10px] font-bold text-morandi-400 opacity-60">Ready to go</div>
            </div>
         </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 px-1">以場次檢視</h2>
        {trips.map(trip => (
          <div 
            key={trip.id} 
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="glass p-5 rounded-[20px] flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform shadow-sm bg-white/40 mb-3 border border-white"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-stone-100 rounded-[20px] flex items-center justify-center font-bold text-stone-400 overflow-hidden">
                 <img src={trip.photos[0]} className="w-full h-full object-cover" />
               </div>
               <div>
                 <div className="text-sm font-bold text-stone-800">{trip.name}</div>
                 <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{trip.date}</div>
               </div>
            </div>
            <div className="text-right">
               <div className="text-sm font-black text-morandi-600">{trip.gearList?.length || 0} 品項</div>
               <div className="text-[10px] text-stone-400 flex items-center gap-1 justify-end">清單明細 <ArrowLeft size={10} className="rotate-180" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsPage = ({ trips }: { trips: CampingTrip[] }) => {
    const totalCampCost = trips.reduce((acc, t) => acc + (t.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0), 0);
    const totalGearCount = trips.reduce((acc, t) => acc + (t.gearList?.length || 0), 0);
    const cities = Array.from(new Set(trips.map(t => t.location.city)));

    return (
      <div className="pb-24 pt-10 px-4">
        <h1 className="text-3xl font-black text-stone-800 mb-10 px-1">數據洞察</h1>

        <div className="space-y-6">
          <div className="glass p-5 rounded-[20px] shadow-sm relative overflow-hidden border border-white bg-morandi-50/30">
            <div className="mesh-gradient-1 scale-150 rotate-45 opacity-20" />
            <div className="text-morandi-600 text-[9px] font-black tracking-widest uppercase mb-1 flex items-center gap-1.5">
              <TrendingUp size={10} /> 總累計預算投入
            </div>
            <div className="text-3xl font-black text-stone-800 tracking-tight">{formatCurrency(totalCampCost)}</div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-morandi-100/50">
               <div className="bg-white/50 p-2.5 rounded-xl border border-white">
                  <div className="text-stone-400 text-[9px] font-black uppercase mb-1 tracking-widest">總計畫場次</div>
                  <div className="text-base font-black text-morandi-700">{trips.length} <span className="text-[10px]">場案</span></div>
               </div>
               <div className="bg-white/50 p-2.5 rounded-xl border border-white">
                  <div className="text-stone-400 text-[9px] font-black uppercase mb-1 tracking-widest">平均單場</div>
                  <div className="text-base font-black text-stone-800">{formatCurrency(totalCampCost / (trips.length || 1))}</div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5 rounded-[20px] text-center border border-blue-100 bg-blue-50/50 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-200/20 rounded-full blur-xl -translate-y-4 translate-x-4" />
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-[20px] flex items-center justify-center mx-auto mb-3 shadow-sm">
                   <Calendar size={20} />
                </div>
                <div className="text-3xl font-black text-blue-900">{trips.length}</div>
                <div className="text-[9px] font-black text-blue-400 mt-1 uppercase tracking-[0.2em]">露營次數 / TRIPS</div>
            </div>
            <div className="glass p-5 rounded-[20px] text-center border border-emerald-100 bg-emerald-50/50 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-200/20 rounded-full blur-xl -translate-y-4 translate-x-4" />
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-[20px] flex items-center justify-center mx-auto mb-3 shadow-sm">
                   <MapPin size={20} />
                </div>
                <div className="text-3xl font-black text-emerald-900">{cities.length}</div>
                <div className="text-[9px] font-black text-emerald-400 mt-1 uppercase tracking-[0.2em]">足跡城市 / CITIES</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="glass p-5 rounded-[20px] flex items-center gap-4 border border-orange-100 bg-orange-50/50 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-xl shadow-sm">🍛</div>
                <div>
                   <p className="text-[9px] text-orange-400 font-black uppercase tracking-widest mb-0.5">單露伙食估計</p>
                   <p className="text-lg font-black text-orange-900">{formatCurrency(totalCampCost / (trips.length || 1))} <span className="text-[10px] font-bold text-orange-400">NTD</span></p>
                </div>
             </div>
             <div className="glass p-5 rounded-[20px] flex items-center gap-4 border border-purple-100 bg-purple-50/50 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-xl shadow-sm">📊</div>
                <div>
                   <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest mb-0.5">預算控制指數</p>
                   <div className="flex items-center gap-2">
                     <p className="text-lg font-black text-purple-900">92%</p>
                     <span className="px-2 py-0.5 bg-purple-200 text-[8px] font-black text-purple-700 rounded-full">穩定優良</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="glass p-5 rounded-[20px] border border-white bg-white/40">
             <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               <div className="w-1 h-3 bg-morandi-400 rounded-full" /> 熱門足跡分佈
             </h3>
             <div className="space-y-6">
                {cities.map(city => (
                    <div key={city} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-300">
                            <Landmark size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1.5">
                                <span className="text-xs font-black text-stone-700">{city}</span>
                                <span className="text-[10px] font-black text-morandi-600">{trips.filter(t => t.location.city === city).length} 場紀錄</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(trips.filter(t => t.location.city === city).length / (trips.length || 1)) * 100}%` }}
                                    className="h-full bg-morandi-400 rounded-full" 
                                />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
};

const SettingsPage = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { nickname: '戶外探險者', avatar: 'https://images.unsplash.com/photo-1502164980785-f8aa41d53611?q=80&w=200&h=200&auto=format&fit=crop' };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState(profile.nickname);

  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev: any) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNickname = () => {
    setProfile((prev: any) => ({ ...prev, nickname: tempNickname }));
    setIsEditing(false);
  };

  return (
    <div className="pb-24 pt-10 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-stone-800">個人檔案</h1>
        <p className="text-stone-500 text-sm mt-1">使用者基本資料</p>
      </header>

      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl relative">
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="text-white" size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-morandi-600 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
            <Camera size={16} />
          </div>
        </div>

        <div className="mt-6 text-center w-full max-w-[200px]">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                className="w-full px-4 py-2 bg-stone-50 border-2 border-morandi-200 rounded-xl outline-none text-center font-bold text-stone-800"
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveNickname}
                  className="flex-1 py-2 bg-morandi-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                >
                  儲存
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-stone-100 text-stone-400 rounded-lg text-[10px] font-black uppercase tracking-widest"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black text-stone-800">{profile.nickname}</h2>
              <button 
                onClick={() => {
                  setTempNickname(profile.nickname);
                  setIsEditing(true);
                }}
                className="text-stone-300 hover:text-morandi-600 transition-colors"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mt-1">Outdoor Explorer</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-5 glass-light rounded-[24px] border border-stone-100 flex items-center justify-between group hover:border-morandi-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-morandi-50 rounded-xl flex items-center justify-center text-morandi-600">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-stone-800">常用營區位置</p>
              <p className="text-[10px] text-stone-400">目前設定：南投、宜蘭</p>
            </div>
          </div>
          <ChevronRight className="text-stone-300 group-hover:text-morandi-400 transition-colors" size={16} />
        </div>

        <div className="p-4 bg-stone-900/5 rounded-[20px] flex items-center justify-between mt-6 hover:bg-red-50/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-400 shadow-sm">
              <LogOut size={14} />
            </div>
            <p className="text-[11px] font-black text-stone-500 group-hover:text-red-500">登出記錄</p>
          </div>
          <div className="text-[9px] font-bold text-stone-300 uppercase tracking-widest px-2">v1.2.0</div>
        </div>
      </div>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [trips, setTrips] = useState<CampingTrip[]>(() => {
    const saved = localStorage.getItem('camping_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved trips', e);
        return MOCK_TRIPS;
      }
    }
    return MOCK_TRIPS;
  });

  useEffect(() => {
    localStorage.setItem('camping_trips', JSON.stringify(trips));
  }, [trips]);

  const handleAddTrip = (newTrip: CampingTrip) => {
    setTrips(prev => [newTrip, ...prev]);
  };

  const handleUpdateTrip = (updatedTrip: CampingTrip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  };

  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-screen relative selection:bg-morandi-100 selection:text-morandi-900 border-x border-stone-200/20 shadow-2xl bg-white">
        <BackgroundMesh />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardPage trips={trips} onAddTrip={handleAddTrip} onDeleteTrip={handleDeleteTrip} />} />
            <Route path="/trip/:id" element={<TripDetailPage trips={trips} onUpdateTrip={handleUpdateTrip} onDeleteTrip={handleDeleteTrip} />} />
            <Route path="/gear" element={<GearPage trips={trips} />} />
            <Route path="/stats" element={<StatsPage trips={trips} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
