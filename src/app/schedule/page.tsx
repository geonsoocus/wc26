export default function SchedulePage() {
  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-[#f0f3f5] pb-24">
      <div className="bg-white px-5 py-4">
        <span className="text-lg font-bold text-[#22252a]">일정</span>
      </div>
      <div className="mt-3 bg-white px-5 py-6">
        <h2 className="text-base font-bold text-[#22252a]">이번 주 일정</h2>
        <div className="mt-4 flex flex-col gap-3">
          {[
            { day: "수", date: "6/4", match: "잠실 LC 풋살파크 20:00" },
            { day: "금", date: "6/6", match: "송파 스포츠센터 21:00" },
            { day: "일", date: "6/8", match: "없음" },
          ].map((d) => (
            <div key={d.date} className="flex items-center gap-4 rounded-xl bg-[#f0f3f5] p-4">
              <div className="flex flex-col items-center w-10">
                <span className="text-xs text-[#676d7e]">{d.day}</span>
                <span className="text-lg font-bold text-[#22252a]">{d.date.split("/")[1]}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#22252a]">{d.match === "없음" ? "매치 없음" : d.match}</p>
                {d.match !== "없음" && <p className="text-xs text-[#676d7e]">6vs6 3파전</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 bg-white px-5 py-6">
        <h2 className="text-base font-bold text-[#22252a]">지난 매치</h2>
        <div className="mt-4 h-24 rounded-xl bg-[#f0f3f5] flex items-center justify-center text-[#9da2af] text-sm">
          지난 매치 기록
        </div>
      </div>
    </div>
  );
}
