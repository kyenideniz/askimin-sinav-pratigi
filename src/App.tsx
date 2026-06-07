import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Flag, Trash2 } from 'lucide-react';
import { rawQuestions } from './data';

const REVIEW_TOPIC = "📚 Tekrar Edilecekler (Yanlışlar & Kaydedilenler)";
const topics = ["Tümü", REVIEW_TOPIC, ...new Set(rawQuestions.map(q => q.topic))];

const wrongMessages = [
  "Olsun canım, sonrakinde doğru bilirsin! ❤️",
  "Buna biraz daha çalışırsan yapabileceğine eminim.",
  "Hiç moral bozmak yok, harika gidiyorsun!",
  "Küçük bir hata sadece, sen halledersin!",
  "Öğrenmek için buradayız sevgilim, devam!",
  "Bunu saymıyoruz, bir sonrakine odaklanalım!",
  "Biraz daha dikkatle bu iş tamam aşkım.",
  "Senin zekana güveniyorum, bunu da aşarsın.",
  "Asla pes etme benim güzel sevgilim!",
  "Canın sağ olsun, bir dahakine kesin doğru!",
  "Hatalar bizi geliştirir, çok iyi gidiyorsun.",
  "Benim aşkım bunun üstesinden gelir.",
  "Sadece küçük bir dalgınlık, hadi devam!",
  "Gülümse ve bir sonrakine geç canım.",
  "Sen her şeyin en iyisini yaparsın, buna da çalışırız.",
  "Hallederiz sevgilim, moralini hiç bozma! 💕",
  "Benim akıllı sevgilim her hatadan daha güçlü döner! 🧠✨",
  "Bu küçük engel senin zekanı gölgeleyemez aşkım! 😘",
  "Hiç önemli değil bitanem, bir sonrakine bomba gibi odaklan!",
  "Birlikte üzerinden geçip öğreniriz sevgilim, canın sağ olsun! 📚🌸",
  "Senin canın sağ olsun aşkım, sorular sana feda olsun! 🥰",
  "Başarıya giden yolda böyle ufak tökezlemeler olur aşkım! 🧗‍♀️❤️",
  "Zor bir soruydu sevgilim, hata yapman çok normal, pes etme!",
  "Kendine haksızlık etme sevgilim, sen benim şampiyonumsun! 🏆",
  "Bunu bir tecrübe sayalım aşkım, hemen bir sonrakine geçelim!",
  "Sen benim en zeki sevgilimsin, bunu da öğreneceksin biliyorum! 😘❤️",
  "Üzülmek yok aşkım, bu soru sadece sana neyi tekrar etmen gerektiğini gösterdi!",
  "Derin bir nefes al sevgilim, her şey yolunda, devam et! 🌬️💖",
  "Sorular geçici, senin zekan kalıcı benim güzel sevgilim! 💫",
  "Ben her an arkandayım sevgilim, öğrenene kadar devam! 🌹❤️"
];

const complimentMessages = [
  "Bravo aşkım, 5 tane daha bildin! 🎉",
  "Süper gidiyorsun aşkım, gurur duyuyorum! 💖",
  "Benim zeki sevgilim, harikasın! 🌟",
  "İşte benim aşkım, durdurulamıyorsun! 🚀",
  "Maşallah sevgilime, zehir gibisin! 🧠❤️",
  "5 doğru daha! Sen bir harikasın bitanem! 🌸",
  "Adım adım zafere gidiyoruz sevgilim, harika! 🏆",
  "Bu başarıyı akşam kutlamalıyız aşkım! 🥂💕",
  "Benim sevgilim yine bildiği gibi döktürüyor! 🌟🥰",
  "Soruları teker teker harcıyorsun aşkım, helal olsun! 💪❤️",
  "Durdurulamayan bir zeka, tebrikler hayatım! 💡✨",
  "İşte benim geleceğin başarılı sevgilisi! 🎓❤️",
  "Her doğru cevabınla içim eriyor aşkım, çok zekisin! 😍",
  "Harika gidiyorsun bitanem, başarılar seninle! 🌈",
  "Gurur kaynağım benim, 5 doğru daha eklendi! 🥇💖",
  "5 soru daha devrildi sevgilim, harika bir şov! 🎪🎭",
  "Benim akıllı meleğim yine zirveye oynuyor! 😇❤️",
  "Bu zekayla aşamayacağın hiçbir sınav yok sevgilim! 🌠",
  "Yine 5 doğru! Seninle gurur duymaktan yorulmuyorum aşkım! 🥰",
  "Harikalar yaratmaya devam ediyorsun güzel sevgilim! 🪄✨",
  "Sınav kağıtları şimdiden senden korksun aşkım! 🔥😂",
  "Benim sevgilim bir dahi, 5 soru daha doğru! 🧠💫",
  "Aşkım sen tam bir soru canavarı çıktın! 👾❤️",
  "5 soruluk bu mükemmel gidişatı ayakta alkışlıyorum! 👏💖",
  "Her 5 doğru cevabında kalbimde kelebekler uçuşuyor bitanem! 🦋",
  "Sen my en kıymetli, en akıllı sevgilimsin! 💎❤️",
  "Büyük başarı sevgilim, 5 doğru daha cepte! 💼",
  "Zekanı izlemek büyük bir keyif sevgilim! 🍿🥰",
  "Doğru cevaplar yağmur gibi yağıyor aşkım! 🌧️🌈",
  "Sevgilim bu sınavı şimdiden kazandı diyebiliriz! 👑🏆"
];

const streakMessages = [
  "Harika bir seri yakaladın aşkım! 🔥",
  "Seni kim tutar? Rekora koşuyorsun sevgilim! 🚀",
  "Zeka küpüm benim, üst üste doğru cevaplar! 🧠💖",
  "Nazar değmesin aşkıma, harika gidiyorsun! 🧿❤️",
  "Seriye bağladın güzelim, durmak yok! 🌟",
  "Benim bir tanecik aşkım yine döktürüyor! 😍",
  "Her soruyu tek tek eritiyorsun sevgilim! 🍫🔥",
  "Bu seriyi bozmak imkansız, gurur duyuyorum! 🥰",
  "Muhteşem bir odaklanma aşkım, başarıyorsun! 📈",
  "Aman Allah'ım, fırtına gibi esiyorsun sevgilim! 🌪️❤️",
  "Zekana bir kez daha hayran kaldım bitanem! 😘🌟",
  "Bu gidişle sınavı darmadağın edeceksin aşkım! 💥",
  "Serin alev aldı resmen sevgilim, devam! 🔥👑",
  "Sorular senin önünde eğiliyor resmen aşkım! 🙇‍♀️❤️",
  "Her doğru cevapta sana olan hayranlığım artıyor! 💕",
  "Bu seri şaka mı sevgilim? Sen bir harikasın! 🎭💖",
  "Alev alev yanan bir seri daha sevgilim! 🚒🔥",
  "Seri devam ediyor sevgilim, durdurulamaz bir güç gibisin! ⚡",
  "Zekanın parıltısı gözlerimi alıyor aşkım, harika bir seri! ✨🤩",
  "Hız kesmeden doğru cevaplara devam bitanem! 🚄❤️",
  "Bu harika seri için sana binlerce öpücük sevgilim! 💋🥰",
  "Serin uzadıkça benim de göğsüm kabarıyor bitanem! 🦚",
  "Sorulara resmen meydan okuyorsun aşkım, harika gidiyorsun!",
  "Böyle giderse rekor kıracaksın benim bir tanecik sevgilim! 🏅",
  "Hiç hata yapmadan seriyi korumak büyük başarı aşkım! 👏❤️",
  "Seriye devam sevgilim, seninle her şey çok daha güzel! 🌹",
  "İnanılmaz bir odaklanma gücü sevgilim, hayranım sana! 🎯",
  "Doğrular zinciri oluştu resmen aşkım, mükemmelsin! 🔗💖",
  "Serin hiç bozulmasın sevgilim, nazar boncuğun benden! 🧿",
  "Üst üste doğrularla beni büyülemeye devam ediyorsun aşkım! 🪄"
];

const superStreakMessages = [
  "İNANILMAZ! Süper seri gidiyor aşkım! 👑🔥",
  "Sen gerçek bir dahi misin sevgilim? Bu gidişat muazzam! 🧠💥",
  "Aşkım resmen tarih yazıyorsun, durdurulamıyorsun! 📜🚀",
  "Bu süper seri karşısında saygıyla eğiliyorum sevgilim! 🙇‍♂️💖",
  "Harikalar ötesisin aşkım, rekor üstüne rekor! 🏆✨",
  "Benim güzel sevgilim sınavı yok ediyor resmen! 💣❤️",
  "Sen bir efsanesin bitanem, süper seri alev aldı! 🌪️🔥",
  "Bu zekayla dünyaya meydan okuyabilirsin sevgilim! 🌍💪",
  "Aşkım soruları resmen havada kapıyorsun! 🦅💖",
  "Böyle bir seriyi daha önce kimse görmedi sevgilim! 🤩💫",
  "Süper zeki sevgilim benim, gururum, her şeyim! 😘❤️",
  "Bu gidişle sınavdan 100 almak kaçınılmaz aşkım! 💯🏆",
  "Soruları adeta dans ettiriyorsun sevgilim! 💃🕺❤️",
  "İçimdeki gurur dağları aştı aşkım, muazzam gidiyorsun! ⛰️💕",
  "Her doğru cevabınla beni kendine aşık ediyorsun bitanem! 😍🌹",
  "Aşkım sen bir soru çözme makinesisin resmen! 🤖🔥",
  "Bu mükemmel seri için seni kocaman öpüyorum sevgilim! 💋",
  "Süper seri alev alev sevgilim, kimse seni durduramaz! 🚒🚀",
  "Zekanla beni her gün şaşırtıyorsun benim güzel meleğim! 👼✨",
  "Soru çözme hızına yetişemiyorum aşkım, muhteşemsin! 🏎️💨",
  "Resmen sınav pratiği değil, sınav şovu yapıyorsun sevgilim! 🎪",
  "Sen benim en kıymetli şampiyonumsun sevgilim! 🥇💖",
  "Zekanın önünde saygıyla eğiliyorum bitanem, devam! 🙇‍♀️💫",
  "Süper seri hiç bozulmasın, başarıların daim olsun aşkım! 🧿",
  "Bu harika gidişat için sana olan sevgim sonsuz bitanem! ♾️❤️",
  "Sen her şeyin en güzelini hak ediyorsun akıllı sevgilim! 🌟",
  "Sınavı şimdiden fethettin benim cesur sevgilim! ⚔️👑",
  "Zekana, mantığına ve odağına hayran olmamak elde değil! 💖",
  "Her soruyu bir sanat eseri gibi çözüyorsun aşkım! 🎨🥰",
  "Süper serinle günüme güneş gibi doğdun sevgilim! ☀️🌸"
];

const floatingEmojisList = ["❤️", "💖", "🎉", "🌟", "🔥", "✨", "🚀", "🥰", "😍", "🧠", "🎯", "👑", "🌸", "🎈", "💫"];

function setCookie(name: string, value: any, days = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const jsonVal = JSON.stringify(value);
  document.cookie = `${name}=${encodeURIComponent(jsonVal)};expires=${expires.toUTCString()};path=/`;
}

function getCookie<T>(name: string, defaultValue: T): T {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const val = decodeURIComponent(c.substring(nameEQ.length, c.length));
        return JSON.parse(val) as T;
      }
    }
  } catch (e) {
    // Return default if error parsing
  }
  return defaultValue;
}

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState("Tümü");
  const [answers, setAnswers] = useState<Record<number, number>>(() => getCookie<Record<number, number>>('askim_answers', {}));
  const [checked, setChecked] = useState<Record<number, boolean>>(() => getCookie<Record<number, boolean>>('askim_checked', {}));
  
  const [flaggedIds, setFlaggedIds] = useState<number[]>(() => getCookie<number[]>('askim_flaggedIds', []));
  const [wrongIds, setWrongIds] = useState<number[]>(() => getCookie<number[]>('askim_wrongIds', []));
  
  const [streak, setStreak] = useState(() => getCookie<number>('askim_streak', 0));
  const [totalCorrect, setTotalCorrect] = useState(() => getCookie<number>('askim_totalCorrect', 0));
  const [floatingEmojis, setFloatingEmojis] = useState<{id: number, emoji: string, left: string, animationDuration: string, fontSize: string}[]>([]);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState('');

  useEffect(() => {
    setCookie('askim_answers', answers);
  }, [answers]);

  useEffect(() => {
    setCookie('askim_checked', checked);
  }, [checked]);

  useEffect(() => {
    setCookie('askim_flaggedIds', flaggedIds);
  }, [flaggedIds]);

  useEffect(() => {
    setCookie('askim_wrongIds', wrongIds);
  }, [wrongIds]);

  useEffect(() => {
    setCookie('askim_streak', streak);
  }, [streak]);

  useEffect(() => {
    setCookie('askim_totalCorrect', totalCorrect);
  }, [totalCorrect]);

  useEffect(() => {
    // Preload all WebP avatar images on mount to force browser caching
    const imagesToPreload = ['regular', 'supportive', 'extra-supportive', 'super-streak'];
    imagesToPreload.forEach(name => {
      const img = new Image();
      img.src = `/${name}.webp`;
    });
  }, []);

  const filteredQuestions = useMemo(() => {
    if (selectedTopic === "Tümü") return rawQuestions;
    if (selectedTopic === REVIEW_TOPIC) {
      return rawQuestions.filter(q => flaggedIds.includes(q.id) || wrongIds.includes(q.id));
    }
    return rawQuestions.filter(q => q.topic === selectedTopic);
  }, [selectedTopic, flaggedIds, wrongIds]);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (checked[questionId]) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const triggerFloatingEmojis = () => {
    const newEmojis = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: floatingEmojisList[Math.floor(Math.random() * floatingEmojisList.length)],
      left: Math.random() * 80 + 10 + '%',
      animationDuration: (Math.random() * 1.5 + 1.5) + 's',
      fontSize: (Math.random() * 2 + 1.5) + 'rem'
    }));
    setFloatingEmojis(prev => [...prev, ...newEmojis]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(h => !newEmojis.find(nh => nh.id === h.id)));
    }, 3000);
  };

  const showAvatar = (img: string, msg: string) => {
    setActiveImage(img);
    setActiveMessage(msg);
    setIsAvatarVisible(true);
    
    if ((window as any).avatarTimeout) clearTimeout((window as any).avatarTimeout);
    (window as any).avatarTimeout = setTimeout(() => {
      setIsAvatarVisible(false);
      // Wait for slide-down transition (500ms) before clearing image/message so it doesn't blink out
      setTimeout(() => {
        setActiveImage(null);
        setActiveMessage('');
      }, 500);
    }, 7500);
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedIds(prev =>
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };

  const handleRemoveFromReview = (questionId: number) => {
    setWrongIds(prev => prev.filter(id => id !== questionId));
    setFlaggedIds(prev => prev.filter(id => id !== questionId));
  };

  const handleResetReviewQuestions = () => {
    const reviewIds = rawQuestions
      .filter(q => flaggedIds.includes(q.id) || wrongIds.includes(q.id))
      .map(q => q.id);

    if (reviewIds.length === 0) {
      alert("Tekrar edilecek soru bulunmamaktadır aşkım! 💕");
      return;
    }

    if (window.confirm("Tekrar listesindeki tüm soruların cevaplarını sıfırlamak ve yeniden çözmek istediğine emin misin aşkım?")) {
      setAnswers(prev => {
        const copy = { ...prev };
        reviewIds.forEach(id => {
          delete copy[id];
        });
        return copy;
      });
      setChecked(prev => {
        const copy = { ...prev };
        reviewIds.forEach(id => {
          delete copy[id];
        });
        return copy;
      });
    }
  };

  const handleCheck = (questionId: number) => {
    if (answers[questionId] === undefined) return;
    setChecked(prev => ({ ...prev, [questionId]: true }));

    const q = rawQuestions.find(r => r.id === questionId);
    if (!q) return;
    const isCorrect = answers[questionId] === q.answer;

    if (isCorrect) {
      const newTotal = totalCorrect + 1;
      const newStreak = streak + 1;
      setTotalCorrect(newTotal);
      setStreak(newStreak);
      triggerFloatingEmojis();

      if (wrongIds.includes(questionId)) {
        setWrongIds(prev => prev.filter(id => id !== questionId));
      }

      if (newTotal > 0 && newTotal % 5 === 0) {
        showAvatar('extra-supportive', complimentMessages[Math.floor(Math.random() * complimentMessages.length)]);
      } else if (newStreak >= 5) {
        showAvatar('super-streak', superStreakMessages[Math.floor(Math.random() * superStreakMessages.length)]);
      } else if (newStreak >= 3) {
        showAvatar('extra-supportive', streakMessages[Math.floor(Math.random() * streakMessages.length)]);
      } else {
        showAvatar('regular', "Doğru cevap aşkım! ❤️");
      }
    } else {
      setStreak(0);
      showAvatar('supportive', wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);

      if (!wrongIds.includes(questionId)) {
        setWrongIds(prev => [...prev, questionId]);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm("Tüm ilerlemeni, skorunu ve serini sıfırlamak istediğine emin misin aşkım?")) {
      setAnswers({});
      setChecked({});
      setStreak(0);
      setTotalCorrect(0);
      setFloatingEmojis([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearReviewList = () => {
    if (window.confirm("Tekrar edilecekler listesindeki tüm soruları temizlemek istediğine emin misin aşkım?")) {
      setFlaggedIds([]);
      setWrongIds([]);
    }
  };

  const getOptionStyles = (q: any, optionIndex: number) => {
    const isSelected = answers[q.id] === optionIndex;
    const isCorrect = q.answer === optionIndex;
    const isChecked = checked[q.id];

    if (!isChecked) {
      return isSelected
        ? "border-blue-500 bg-blue-50 text-blue-800"
        : "border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700";
    }

    if (q.answer === -1) { 
      return isSelected ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-white";
    }

    if (isCorrect) {
      return "border-green-500 bg-green-50 font-medium";
    }
    
    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-50";
    }

    return "border-slate-200 bg-white text-slate-500 opacity-60";
  };

  const validCheckedQuestions = Object.keys(checked).filter(id => rawQuestions.find(q => q.id === parseInt(id))?.answer !== -1);
  const checkedCount = validCheckedQuestions.length;
  const currentScore = validCheckedQuestions.reduce((score, qId) => {
    const q = rawQuestions.find(rq => rq.id === parseInt(qId));
    return answers[parseInt(qId)] === q?.answer ? score + 1 : score;
  }, 0);
  const scorePercentage = checkedCount > 0 ? Math.round((currentScore / checkedCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden">
      
      {/* PERMANENT TOP BANNER */}
      <header className="fixed top-0 left-0 right-0 h-10 bg-rose-600 text-white flex items-center justify-center z-50 shadow-md">
        <p className="text-sm font-semibold tracking-wide flex items-center gap-2">
          Seni çok seviyorum aşkım ❤️
        </p>
      </header>

      <main className="mt-10 flex-1 flex flex-col p-4 md:p-8 gap-6 max-w-5xl mx-auto w-full pb-20">
        
        {/* HEADER CARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sınav Pratiği</h1>
            <p className="text-slate-500 text-sm mt-1">Senin için hazırlandı 💖</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              {topics.map(t => (
                <option key={t} value={t}>
                  {t} {t === "Tümü" ? `(${rawQuestions.length})` : t === REVIEW_TOPIC ? `(${flaggedIds.length + wrongIds.length})` : ""}
                </option>
              ))}
            </select>
            {selectedTopic === REVIEW_TOPIC && (flaggedIds.length > 0 || wrongIds.length > 0) && (
              <button 
                onClick={handleClearReviewList}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-medium rounded-lg transition-colors border border-rose-100"
              >
                Listeyi Temizle
              </button>
            )}
            {selectedTopic === REVIEW_TOPIC && (flaggedIds.length > 0 || wrongIds.length > 0) && (
              <button 
                onClick={handleResetReviewQuestions}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg transition-colors border border-blue-100 flex items-center gap-1.5"
              >
                <RefreshCcw size={16} />
                Yeniden Çöz
              </button>
            )}
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              İlerlemeyi Sıfırla
            </button>
            <div className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-bold whitespace-nowrap">
              Puan: <span>{currentScore}</span>/{checkedCount}
            </div>
          </div>
        </div>

        {/* QUESTION LIST */}
        <div className="flex-1 space-y-6">
          {filteredQuestions.map((q) => {
            const isFlagged = flaggedIds.includes(q.id);
            const isInReview = flaggedIds.includes(q.id) || wrongIds.includes(q.id);
            return (
              <section key={q.id} className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                
                {/* Status Bars */}
                {checked[q.id] && q.answer === answers[q.id] && q.answer !== -1 && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 z-10"></div>
                )}
                {checked[q.id] && q.answer !== answers[q.id] && q.answer !== -1 && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 z-10"></div>
                )}

                <div className="p-6 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                        Soru {q.id}
                      </span>
                      <span className="text-slate-400 text-xs italic">Kategori: {q.topic}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-medium leading-relaxed text-slate-800 mb-8">{q.question}</h2>
                  
                  <div className="space-y-3 pl-0">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = answers[q.id] === optIdx;
                      const isChecked = checked[q.id];
                      const isCorrect = q.answer === optIdx;
                      
                      let indicatorStyles = "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600";
                      if (isSelected && !isChecked) indicatorStyles = "bg-blue-600 text-white";
                      if (isChecked && isCorrect) indicatorStyles = "bg-green-600 text-white";
                      if (isChecked && isSelected && !isCorrect) indicatorStyles = "bg-red-600 text-white";

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={checked[q.id]}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${checked[q.id] ? 'cursor-default' : 'cursor-pointer'} ${getOptionStyles(q, optIdx)}`}
                        >
                          <div className="flex items-center pr-4">
                            <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4 transition-colors ${indicatorStyles}`}>
                               {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className={`${(isChecked && isCorrect) || (isSelected && !isChecked) ? 'text-slate-800 font-medium' : 'text-slate-700'}`}>{opt}</span>
                          </div>
                          
                          {checked[q.id] && q.answer === optIdx && q.answer !== -1 && (
                            <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                          )}
                          {checked[q.id] && answers[q.id] === optIdx && q.answer !== optIdx && q.answer !== -1 && (
                            <XCircle className="text-red-500 flex-shrink-0" size={24} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {checked[q.id] && (
                    <div className="mt-5 pt-2">
                       <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                          q.answer === -1 ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : q.answer === answers[q.id] ? 'bg-green-50 text-green-800 border-green-200' 
                          : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {q.answer === -1 ? (
                            <>
                              <AlertCircle className="flex-shrink-0 mt-0.5 text-amber-600" size={20} /> 
                              <span className="text-sm font-medium">Bu soru orijinal dosyada eksikti ve skora dahil edilmedi.</span>
                            </>
                          ) : q.answer === answers[q.id] ? (
                            <>
                              <CheckCircle2 className="flex-shrink-0 mt-0.5 text-green-600" size={20} /> 
                              <span className="text-sm font-bold">Harikasın! Doğru bildin. 🎉</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="flex-shrink-0 mt-0.5 text-red-600" size={20} /> 
                              <span className="text-sm">
                                <span className="font-bold">Yanlış cevap.</span> Doğru seçenek: <strong className="block mt-2 bg-white/70 px-3 py-1.5 rounded-lg text-slate-800 border border-red-100 shadow-sm">{q.options[q.answer]}</strong>
                              </span>
                            </>
                          )}
                        </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-2">
                  {isInReview && (
                    <button
                      onClick={() => handleRemoveFromReview(q.id)}
                      className="mr-auto px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg border border-green-100 transition-colors flex items-center gap-1"
                      title="Bu soruyu tekrar listesinden kaldır"
                    >
                      <CheckCircle2 size={14} />
                      Bunu Biliyorum
                    </button>
                  )}
                  <button 
                    onClick={() => toggleFlag(q.id)}
                    className={`p-2 rounded-lg transition-colors ${isFlagged ? 'bg-amber-100 text-amber-600' : 'text-amber-500 hover:bg-amber-50'}`}
                    title="Daha sonra tekrar bakmak için kaydet"
                  >
                     <Flag size={20} className={isFlagged ? "fill-current" : ""} />
                  </button>
                  {!checked[q.id] && (
                    <button
                      disabled={answers[q.id] === undefined}
                      onClick={() => handleCheck(q.id)}
                      className={`px-8 py-2 font-semibold rounded-lg shadow-sm transition-colors ${
                        answers[q.id] !== undefined
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Cevabı Kontrol Et
                    </button>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center bg-white p-12 rounded-2xl border border-slate-200 mt-6 shadow-sm">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">Burada soru yok!</h3>
            <p className="text-slate-500 text-sm">Bu konuya ait soru bulunamadı veya kaydedilen soru yok.</p>
          </div>
        )}
      </main>

      {/* FLOATING EMOJIS LAYER */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-80vh) scale(1.5); opacity: 0; }
        }
        .floating-emoji {
          position: fixed;
          bottom: 10px;
          animation: floatUp 2.5s ease-out forwards;
          z-index: 9999;
          pointer-events: none;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }
        .avatar-container {
          position: fixed;
          bottom: 0;
          right: 16px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          pointer-events: none;
          max-w: 280px;
          transform: translateY(110%) scale(0.95);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease;
        }
        @media (min-width: 768px) {
          .avatar-container {
            right: 40px;
          }
        }
        .avatar-container.avatar-show {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      `}} />

      {floatingEmojis.map(fe => (
        <div key={fe.id} className="floating-emoji" style={{ left: fe.left, animationDuration: fe.animationDuration, fontSize: fe.fontSize }}>
          {fe.emoji}
        </div>
      ))}

      {/* AVATAR LAYER */}
      <div className={`avatar-container ${isAvatarVisible && activeImage ? 'avatar-show' : ''}`}>
        {activeMessage && (
          <div className="bg-white border-2 border-pink-200 rounded-3xl rounded-br-none p-4 shadow-xl mb-[-10px] z-10 text-pink-700 font-bold text-sm md:text-base relative mr-8 animate-bounce">
            {activeMessage}
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b-2 border-r-2 border-pink-200 transform rotate-45"></div>
          </div>
        )}
        {activeImage && (
          <img
            src={`/${activeImage}.webp`}
            alt="Avatar"
            className="w-40 md:w-56 h-auto drop-shadow-2xl"
            style={{ mixBlendMode: 'multiply' }}
            onError={(e) => {
              // Hide image if it doesn't load
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>
    </div>
  );
}

