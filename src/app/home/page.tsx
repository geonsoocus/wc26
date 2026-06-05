export default function HomePage() {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#f0f3f5] pb-24">
      <div className="bg-white px-5 py-4">
        <span className="text-lg font-bold text-[#22252a]">플랩</span>
      </div>
      <div className="mt-3 bg-white px-5 py-6">
        <h2 className="text-base font-bold text-[#22252a]">오늘의 매치</h2>
        <div className="mt-4 flex flex-col gap-3">
          {["잠실 LC 풋살파크 · 20:00", "송파 스포츠센터 · 21:00", "강남 더풋살 · 22:00"].map((m) => (
            <div key={m} className="flex items-center gap-3 rounded-xl bg-[#f0f3f5] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22252a] text-white text-lg">⚽</div>
              <div>
                <p className="text-sm font-bold text-[#22252a]">{m.split("·")[0]}</p>
                <p className="text-xs text-[#676d7e]">{m.split("·")[1]} · 6vs6 3파전</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 bg-white px-5 py-6">
        <h2 className="text-base font-bold text-[#22252a]">추천 매치</h2>
        <p className="mt-2 text-sm text-[#676d7e]">내 레벨에 맞는 매치를 추천해드려요</p>
        <div className="mt-4 h-32 rounded-xl bg-[#f0f3f5] flex items-center justify-center text-[#9da2af] text-sm">
          매치 목록
        </div>
      </div>
    </div>
  );
}
