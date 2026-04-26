import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Check, Dumbbell, Flower2, ZapIcon, ArrowRight, User } from 'lucide-react';

const Homepage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Hiệu ứng Parallax mạnh hơn cho Hero
  const videoScale = useTransform(scrollY, [0, 800], [1, 1.25]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 600], [0, 150]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Variants hiệu ứng xuất hiện (Reveal Animations)
  const containerReveal = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
  };

  const itemFadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
  };

  return (
    <div className="bg-[#0f0f0f] text-white selection:bg-[#d03030] overflow-x-hidden font-sans">
      
      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-8'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-normal flex items-center gap-2 text-white no-underline">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              whileHover={{ rotate: 180, scale: 1.1 }} 
              className="w-8 h-8 bg-[#d03030] rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(208,48,48,0.5)]"
            >
              <Dumbbell size={18} />
            </motion.div>
            TWELVE<span className="text-[#d03030]">FIT</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] uppercase font-bold tracking-[2px]">
            {['Bộ môn', 'Gói tập', 'Chi nhánh', 'Sứ mệnh'].map((item, i) => (
              <a key={i} href={`#${item}`} className="text-gray-300 hover:text-white no-underline transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#d03030] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="flex items-center gap-2 bg-white/10 hover:bg-[#d03030] px-6 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all duration-300 text-white no-underline border border-white/10 hover:shadow-[0_0_20px_rgba(208,48,48,0.4)]">
              <User size={14} /> Đăng nhập
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* 1. HERO SECTION */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('anh.avif')", scale: videoScale, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#0f0f0f]"></div>
        </motion.div>

        <motion.div style={{ y: heroTextY }} className="relative z-10 text-center px-6 w-full max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="mb-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lg"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[3px] text-gray-200">Khai trương chi nhánh Thủ Đức</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="text-6xl md:text-[100px] lg:text-[120px] font-black uppercase leading-[1.1] tracking-normal mb-8"
          >
            BỨT PHÁ <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d03030] via-[#ff5e00] to-[#d03030] bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
              GIỚI HẠN
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6, duration: 1 }} 
            className="max-w-xl mx-auto text-gray-300 text-lg font-light mb-12 tracking-wide"
          >
            Hệ thống phòng tập chuẩn 5 sao. Nơi công nghệ Technogym giao thoa cùng tinh thần chiến binh không bỏ cuộc.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {/* SỬA LỖI ĐIỀU HƯỚNG: Truyền state={{ mode: 'register' }} qua trang /login */}
            <Link to="/login" state={{ mode: 'register' }} className="no-underline">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(208,48,48,0.6)" }} 
                whileTap={{ scale: 0.95 }} 
                className="relative overflow-hidden bg-[#d03030] text-white px-10 py-5 font-black uppercase text-xs tracking-[2px] border-none cursor-pointer group"
              >
                <span className="relative z-10">Bắt đầu hành trình</span>
                {/* Hiệu ứng ánh sáng lướt qua */}
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </motion.button>
            </Link>

            <Link to="/login" className="no-underline">
              <motion.button 
                whileHover={{ backgroundColor: "#ffffff", color: "#000000" }} 
                whileTap={{ scale: 0.95 }} 
                className="flex items-center gap-3 bg-transparent border border-white/30 px-10 py-5 font-black uppercase text-xs tracking-[2px] text-white transition-all cursor-pointer"
              >
                Đăng nhập hệ thống
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* 2. BỘ MÔN */}
      <section id="Bộ môn" className="py-32 container mx-auto px-6 overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerReveal}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6 text-start">
            <motion.div variants={itemFadeLeft}>
              <h2 className="text-[#d03030] font-bold uppercase tracking-[3px] text-sm mb-4">Personalized Training</h2>
              <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.1]">ĐA DẠNG <br /> CHẾ ĐỘ TẬP</h3>
            </motion.div>
            <motion.p variants={itemFadeUp} className="text-gray-400 max-w-sm font-light italic">"Chúng tôi không chỉ có Gym. Chúng tôi có mọi thứ để bạn cân bằng Thân - Tâm - Trí."</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            {[
              { title: "Power Gym", icon: <Dumbbell />, desc: "Dàn máy Technogym AI thế hệ mới.", color: "#d03030" },
              { title: "Yoga Flow", icon: <Flower2 />, desc: "Không gian tĩnh lặng, Master từ Ấn Độ.", color: "#7c3aed" },
              { title: "HIIT & Cardio", icon: <ZapIcon />, desc: "Đốt cháy 800kcal mỗi giờ tập.", color: "#f59e0b" }
            ].map((item, i) => (
              <motion.div 
                key={i} variants={itemFadeUp} 
                whileHover={{ y: -20, scale: 1.02, borderColor: item.color }} 
                className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] p-10 rounded-2xl border border-white/5 group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              >
                <motion.div 
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 15, scale: 1.2 }}
                  className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-8 shadow-inner"
                >
                  {React.cloneElement(item.icon, { style: { color: item.color }, size: 28 })}
                </motion.div>
                <h4 className="text-2xl font-black uppercase mb-4 tracking-normal">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed font-light mb-8 group-hover:text-gray-300 transition-colors">{item.desc}</p>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#d03030] group-hover:gap-5 transition-all">
                  Khám phá <ArrowRight size={14} />
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. GÓI TẬP */}
      <section id="Gói tập" className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 text-start relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black uppercase mb-20 tracking-tight"
          >
            ĐẶC QUYỀN <span className="text-[#d03030]">HỘI VIÊN</span>
          </motion.h2>
          
          <motion.div variants={containerReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Khởi Động", price: "500.000", features: ["Gym cơ bản", "Tủ đồ", "App TwelveFit"], color: "white" },
              { name: "Đam Mê (PRO)", price: "800.000", features: ["Group X & Yoga", "Sauna", "Khăn tập"], color: "#d03030", best: true },
              { name: "Tinh Anh (ELITE)", price: "1.200.000", features: ["VIP Lounge", "2 buổi PT/tháng", "Giảm 10% F&B"], color: "#fbbf24" }
            ].map((pkg, i) => (
              <motion.div 
                key={i} variants={itemFadeUp}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`relative bg-[#0f0f0f] p-10 border transition-all duration-300 flex flex-col rounded-xl ${pkg.best ? 'border-[#d03030] shadow-[0_15px_50px_rgba(208,48,48,0.2)] z-10' : 'border-white/10 hover:border-white/30'}`}
              >
                {pkg.best && (
                  <motion.div 
                    animate={{ y: [0, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#d03030] px-6 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-lg"
                  >
                    Bán chạy nhất
                  </motion.div>
                )}
                <h4 className="text-xl font-black mb-6 flex items-center gap-2 tracking-normal">
                  <div className="w-2 h-6 rounded-full" style={{ backgroundColor: pkg.color }}></div> {pkg.name}
                </h4>
                <div className="mb-8">
                  <span className="text-4xl font-black">{pkg.price}</span>
                  <span className="text-gray-500 text-sm italic ml-2">đ / THÁNG</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {pkg.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                      <motion.div whileHover={{ scale: 1.5, rotate: 360 }} transition={{ duration: 0.3 }}>
                        <Check size={16} className="text-[#d03030]" />
                      </motion.div> 
                      {f}
                    </div>
                  ))}
                </div>
                
                {/* SỬA LỖI ĐIỀU HƯỚNG TẠI ĐÂY NỮA */}
                <Link to="/login" state={{ mode: 'register' }} className="w-full mt-auto block no-underline">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-sm font-bold uppercase text-[10px] tracking-widest transition-all cursor-pointer border-none ${pkg.best ? 'bg-[#d03030] text-white hover:bg-white hover:text-black shadow-[0_5px_20px_rgba(208,48,48,0.4)]' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}
                  >
                    Đăng ký hội viên
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. CHI NHÁNH */}
      <section id="Chi nhánh" className="py-32 container mx-auto px-6 overflow-hidden">
        <motion.h2 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center text-4xl md:text-6xl font-black uppercase mb-20 tracking-tight"
        >
          HỆ THỐNG <span className="text-[#d03030]">CHI NHÁNH</span>
        </motion.h2>
        
        <div className="space-y-10 text-start max-w-6xl mx-auto">
          {[
            { 
              name: "TwelveFit Quận 1", 
              addr: "123 Lê Lợi, P. Bến Thành, Q.1", 
              img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070", 
              active: "450",
              mapLink: "https://maps.app.goo.gl/n76dFJc41f2HBJd5A"
            },
            { 
              name: "TwelveFit Thủ Đức", 
              addr: "98 Đ. Võ Văn Ngân, Bình Thọ, Thủ Đức, Hồ Chí Minh", 
              img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075", 
              active: "210",
              mapLink: "https://maps.app.goo.gl/6MVTXasvAqc9Lh8z7"
            }
          ].map((branch, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              className="group flex flex-col lg:flex-row bg-[#111] overflow-hidden border border-white/5 hover:border-[#d03030]/50 transition-all duration-500 rounded-2xl shadow-lg hover:shadow-[0_0_40px_rgba(208,48,48,0.15)]"
            >
              <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden relative">
                <img src={branch.img} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-[1.5s] ease-out" alt={branch.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent lg:bg-gradient-to-r opacity-80 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div className="flex-1 p-10 flex flex-col justify-center relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-black uppercase tracking-tight">{branch.name}</h3>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full text-[10px] font-bold border border-green-500/20"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ĐANG HOẠT ĐỘNG
                  </motion.div>
                </div>
                <div className="flex items-center gap-3 text-gray-400 mb-10 text-sm">
                  <MapPin size={18} className="text-[#d03030] animate-bounce" /> {branch.addr}
                </div>
                
                <div className="flex flex-wrap gap-8 items-center justify-between border-t border-white/5 pt-8 mt-auto">
                  <div>
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-3xl font-black mb-1">{branch.active}</motion.p>
                    <p className="text-[10px] uppercase tracking-[2px] text-gray-500 m-0">Hội viên đang tập</p>
                  </div>
                  
                  <a href={branch.mapLink} target="_blank" rel="noopener noreferrer" className="no-underline">
                    <motion.button 
                      whileHover={{ backgroundColor: '#d03030', color: '#fff', borderColor: '#d03030', y: -3 }} 
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/20 bg-transparent text-white px-8 py-4 transition-all cursor-pointer rounded-sm"
                    >
                      <MapPin size={14} /> Xem bản đồ
                    </motion.button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. SỨ MỆNH VÀ TẦM NHÌN */}
      <section id="Sứ mệnh" className="py-32 bg-[#0a0a0a] border-t border-white/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d03030]/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -80 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }} 
              className="text-start"
            >
              <h2 className="text-[#d03030] font-black text-5xl md:text-6xl uppercase tracking-tight mb-10 leading-[1.1]">
                TẦM NHÌN <br/> <span className="text-white">& SỨ MỆNH</span>
              </h2>
              <div className="space-y-12">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-4">
                    <motion.div animate={{ width: [0, 32] }} transition={{ duration: 1 }} className="h-[2px] bg-[#d03030]"></motion.div> TẦM NHÌN CHIẾN LƯỢC
                  </h5>
                  <p className="text-gray-400 text-base leading-relaxed font-light">
                    Trở thành hệ sinh thái Wellness hàng đầu Việt Nam, mang công nghệ luyện tập hiện đại nhất thế giới đến gần hơn với cộng đồng, thay đổi hoàn toàn quan niệm về Fitness truyền thống.
                  </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                  <h5 className="text-white font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-4">
                    <motion.div animate={{ width: [0, 32] }} transition={{ duration: 1, delay: 0.2 }} className="h-[2px] bg-[#d03030]"></motion.div> SỨ MỆNH CAO CẢ
                  </h5>
                  <p className="text-gray-400 text-base leading-relaxed font-light">
                    Truyền cảm hứng sống khỏe và đánh thức tiềm năng bên trong mỗi cá nhân. TwelveFit cam kết đồng hành cùng bạn trên hành trình chinh phục những giới hạn mới của bản thân.
                  </p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }} 
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }} 
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }} 
              className="relative"
            >
               <img src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069" className="w-full h-[500px] object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl" alt="Sứ mệnh TwelveFit" />
               <div className="absolute -inset-4 border border-[#d03030]/30 z-[-1] rounded-2xl animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12 text-start max-w-6xl mx-auto">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black tracking-normal mb-6 uppercase">TWELVE<span className="text-[#d03030]">FIT</span></h2>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-8 font-light italic text-sm">
              "TwelveFit không chỉ là một phòng tập, đó là nơi bắt đầu của một cuộc đời mới."
            </p>
          </div>
          <div>
            <h5 className="text-[#d03030] font-bold uppercase tracking-widest text-xs mb-6">Mạng xã hội</h5>
            <div className="flex flex-col gap-4 text-gray-400 text-sm font-light">
              <motion.a whileHover={{ x: 5, color: "#d03030" }} href="https://www.instagram.com/twelvefitness?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-gray-400 no-underline transition-colors w-fit">Instagram</motion.a>
              <motion.a whileHover={{ x: 5, color: "#d03030" }} href="https://www.facebook.com/gymtwelve" target="_blank" rel="noopener noreferrer" className="text-gray-400 no-underline transition-colors w-fit">Facebook</motion.a>
            </div>
          </div>
          <div>
            <h5 className="text-[#d03030] font-bold uppercase tracking-widest text-xs mb-6">Liên hệ</h5>
            <p className="text-gray-400 text-sm leading-loose font-light">
              Hotline: <span className="text-white font-medium">1900 3434</span> <br />
              Email: vominhthong@twelvefit.vn <br />
              Trụ sở: 123 Lê Lợi, P. Bến Thành, Q.1, TP. HCM
            </p>
          </div>
        </div>
      </footer>
      
      {/* Thêm chút CSS cho Keyframes Shimmer & Gradient */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default Homepage;