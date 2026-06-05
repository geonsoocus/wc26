export default function MyPage() {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#f0f3f5] pb-24">
      <div className="bg-white px-5 py-4">
        <span className="text-lg font-bold text-[#22252a]">MY</span>
      </div>
      <div className="mt-3 bg-white px-5 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f3f5]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9da2af" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <div>
            <p className="text-base font-bold text-[#22252a]">플래버</p>
            <p className="text-xs text-[#676d7e]">아마추어2 · 매치 42회</p>
          </div>
        </div>
      </div>
      <div className="mt-3 bg-white px-5 py-4">
        {["내 매치 기록", "칭찬 내역", "쿠폰함", "설정", "고객센터"].map((item) => (
          <div key={item} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <span className="text-sm text-[#22252a]">{item}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9da2af" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        ))}
      </div>
    </div>
  );
}
