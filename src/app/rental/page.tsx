export default function RentalPage() {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#f0f3f5] pb-24">
      <div className="bg-white px-5 py-4">
        <span className="text-lg font-bold text-[#22252a]">구장 예약</span>
      </div>
      <div className="mt-3 bg-white px-5 py-6">
        <h2 className="text-base font-bold text-[#22252a]">내 주변 구장</h2>
        <div className="mt-4 h-48 rounded-xl bg-[#f0f3f5] flex items-center justify-center text-[#9da2af] text-sm">
          지도 영역
        </div>
      </div>
      <div className="mt-3 bg-white px-5 py-6">
        <h2 className="text-base font-bold text-[#22252a]">인기 구장</h2>
        <div className="mt-4 flex flex-col gap-3">
          {["잠실 LC 풋살파크", "송파 스포츠센터", "강남 더풋살", "서초 풋살장"].map((name) => (
            <div key={name} className="flex items-center gap-3 rounded-xl bg-[#f0f3f5] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22252a] text-white text-lg">🏟️</div>
              <div>
                <p className="text-sm font-bold text-[#22252a]">{name}</p>
                <p className="text-xs text-[#676d7e]">예약 가능</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
