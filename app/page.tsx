
"use client";

import { useMemo, useState } from "react";
import rawData from "../data/capstone.json";

type Row = {
  year: number;
  schoolType: string;
  ownership: string;
  regionRaw: string;
  region: string;
  status: string;
  school: string;
  majorStudents: number;
  otherHumanities: number;
  otherScience: number;
  otherEngineering: number;
  otherMedicine: number;
  otherArts: number;
  otherStudents: number;
  totalStudents: number;
  fundedStudents: number;
  prototypeFund: number;
  programFund: number;
  totalFund: number;
  reportTitle: string;
};

type Tab = "overview" | "schools" | "compare" | "quality";

const data = rawData as Row[];
const nf = new Intl.NumberFormat("ko-KR");

function formatWon(value: number) {
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(1)}억원`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(1)}만원`;
  return `${nf.format(Math.round(value))}원`;
}

function formatPct(value: number) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "-";
}

function deltaText(current: number, previous: number, point = false) {
  if (!Number.isFinite(previous) || previous === 0) return "-";
  const value = point ? (current - previous) * 100 : (current / previous - 1) * 100;
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}${point ? "%p" : "%"}`;
}

function sum(rows: Row[], key: keyof Row) {
  return rows.reduce((acc, row) => acc + Number(row[key] ?? 0), 0);
}

function KpiCard({
  label, value, delta, tone = "blue"
}: { label: string; value: string; delta?: string; tone?: string }) {
  const negative = delta?.startsWith("-");
  return (
    <div className={`kpi-card ${tone}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {delta && delta !== "-" && (
        <div className={`kpi-delta ${negative ? "down" : "up"}`}>
          {negative ? "▼" : "▲"} {delta} 전년 대비
        </div>
      )}
    </div>
  );
}

function BarChart({
  title, items, color = "#2563eb", formatter = (v: number) => nf.format(v)
}: {
  title: string;
  items: { label: string; value: number; sub?: string }[];
  color?: string;
  formatter?: (v: number) => string;
}) {
  const max = Math.max(...items.map((x) => x.value), 1);
  return (
    <section className="panel">
      <div className="panel-heading">
        <h3>{title}</h3>
        <span>상위 {items.length}개</span>
      </div>
      <div className="bars">
        {items.map((item) => (
          <div className="bar-row" key={item.label}>
            <div className="bar-name" title={item.label}>{item.label}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${Math.max((item.value / max) * 100, 1)}%`, background: color }}
              />
            </div>
            <div className="bar-value">{formatter(item.value)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Donut({
  prototype, program
}: { prototype: number; program: number }) {
  const total = prototype + program || 1;
  const p = prototype / total;
  const deg = p * 360;
  return (
    <section className="panel budget-panel">
      <div className="panel-heading"><h3>지원금 구성</h3><span>선택 연도</span></div>
      <div className="donut-wrap">
        <div
          className="donut"
          style={{ background: `conic-gradient(#2563eb 0deg ${deg}deg, #10b981 ${deg}deg 360deg)` }}
        >
          <div className="donut-hole">
            <b>{formatWon(total)}</b>
            <span>총지원금</span>
          </div>
        </div>
        <div className="legend">
          <div><i style={{ background: "#2563eb" }} /><span>시제(작)품 제작비</span><b>{formatWon(prototype)}</b></div>
          <div><i style={{ background: "#10b981" }} /><span>교육프로그램 지원비</span><b>{formatWon(program)}</b></div>
        </div>
      </div>
    </section>
  );
}

function TrendChart({ rows }: { rows: Row[] }) {
  const years = [...new Set(rows.map((r) => r.year))].sort();
  const values = years.map((year) => ({
    year,
    students: sum(rows.filter((r) => r.year === year), "totalStudents"),
    funded: sum(rows.filter((r) => r.year === year), "fundedStudents"),
  }));
  const max = Math.max(...values.flatMap((x) => [x.students, x.funded]), 1);
  return (
    <section className="panel trend-panel">
      <div className="panel-heading"><h3>연도별 학생 운영 현황</h3><span>전체 필터 반영</span></div>
      <div className="trend-legend">
        <span><i className="dot students" />총 이수학생</span>
        <span><i className="dot funded" />지원금 수령 학생</span>
      </div>
      <div className="column-chart">
        {values.map((item) => (
          <div className="year-group" key={item.year}>
            <div className="columns">
              <div className="column students" style={{ height: `${(item.students / max) * 190}px` }}>
                <span>{nf.format(item.students)}</span>
              </div>
              <div className="column funded" style={{ height: `${(item.funded / max) * 190}px` }}>
                <span>{nf.format(item.funded)}</span>
              </div>
            </div>
            <b>{item.year}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const years = useMemo(() => [...new Set(data.map((r) => r.year))].sort(), []);
  const regions = useMemo(() => [...new Set(data.map((r) => r.region))].sort(), []);
  const ownerships = useMemo(() => [...new Set(data.map((r) => r.ownership))].sort(), []);
  const schoolTypes = useMemo(() => [...new Set(data.map((r) => r.schoolType))].sort(), []);

  const [tab, setTab] = useState<Tab>("overview");
  const [year, setYear] = useState(Math.max(...years));
  const [region, setRegion] = useState("전체");
  const [ownership, setOwnership] = useState("전체");
  const [schoolType, setSchoolType] = useState("전체");
  const [query, setQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [compareSchools, setCompareSchools] = useState<string[]>([]);

  const commonFiltered = useMemo(() => data.filter((r) => {
    if (region !== "전체" && r.region !== region) return false;
    if (ownership !== "전체" && r.ownership !== ownership) return false;
    if (schoolType !== "전체" && r.schoolType !== schoolType) return false;
    if (query && !r.school.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [region, ownership, schoolType, query]);

  const current = useMemo(
    () => commonFiltered.filter((r) => r.year === year),
    [commonFiltered, year]
  );
  const previous = useMemo(
    () => commonFiltered.filter((r) => r.year === year - 1),
    [commonFiltered, year]
  );

  const currentStudents = sum(current, "totalStudents");
  const currentFunded = sum(current, "fundedStudents");
  const currentFund = sum(current, "totalFund");
  const currentRate = currentStudents ? currentFunded / currentStudents : 0;
  const currentPerPerson = currentFunded ? currentFund / currentFunded : 0;

  const previousStudents = sum(previous, "totalStudents");
  const previousFunded = sum(previous, "fundedStudents");
  const previousFund = sum(previous, "totalFund");
  const previousRate = previousStudents ? previousFunded / previousStudents : 0;
  const previousPerPerson = previousFunded ? previousFund / previousFunded : 0;

  const schools = useMemo(
    () => [...new Set(commonFiltered.map((r) => r.school))].sort(),
    [commonFiltered]
  );

  const activeSchool = selectedSchool && schools.includes(selectedSchool)
    ? selectedSchool
    : schools[0] || "";
  const schoolRows = commonFiltered
    .filter((r) => r.school === activeSchool)
    .sort((a, b) => a.year - b.year);

  const topStudents = [...current]
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 10)
    .reverse()
    .map((r) => ({ label: r.school, value: r.totalStudents }));

  const topFund = [...current]
    .sort((a, b) => b.totalFund - a.totalFund)
    .slice(0, 10)
    .reverse()
    .map((r) => ({ label: r.school, value: r.totalFund }));

  const qualityIssues = useMemo(() => {
    const issues: { rule: string; level: "오류" | "경고"; message: string; row: Row }[] = [];
    commonFiltered.forEach((r) => {
      if (r.fundedStudents > r.totalStudents) {
        issues.push({ rule: "DQ-04", level: "오류", message: "수령 학생 수가 총 이수학생 수보다 큼", row: r });
      }
      if (r.fundedStudents === 0 && r.totalFund > 0) {
        issues.push({ rule: "DQ-05", level: "경고", message: "수령 학생 0명이나 지원금 존재", row: r });
      }
      if (r.fundedStudents > 0 && r.totalFund === 0) {
        issues.push({ rule: "DQ-06", level: "경고", message: "수령 학생이 있으나 지원금 0원", row: r });
      }
      if (r.regionRaw === "전남광주") {
        issues.push({ rule: "DQ-07", level: "경고", message: "지역 표준화 확인 필요", row: r });
      }
    });
    return issues;
  }, [commonFiltered]);

  const exportCsv = () => {
    const headers = [
      "기준연도","학교종류","설립구분","지역","학교","총이수학생수",
      "지원금수령학생수","지원금수령률","시제품제작비","교육프로그램지원비","총지원금"
    ];
    const lines = current.map((r) => [
      r.year, r.schoolType, r.ownership, r.region, r.school, r.totalStudents,
      r.fundedStudents, r.totalStudents ? r.fundedStudents / r.totalStudents : 0,
      r.prototypeFund, r.programFund, r.totalFund
    ].map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","));
    const blob = new Blob(["\uFEFF" + [headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `capstone_dashboard_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCompare = (school: string) => {
    setCompareSchools((prev) => {
      if (prev.includes(school)) return prev.filter((x) => x !== school);
      if (prev.length >= 5) return prev;
      return [...prev, school];
    });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div><b>Capstone Insight</b><span>운영 현황 분석</span></div>
        </div>

        <nav>
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>▦ 종합 현황</button>
          <button className={tab === "schools" ? "active" : ""} onClick={() => setTab("schools")}>▤ 대학별 현황</button>
          <button className={tab === "compare" ? "active" : ""} onClick={() => setTab("compare")}>⇄ 대학 비교</button>
          <button className={tab === "quality" ? "active" : ""} onClick={() => setTab("quality")}>✓ 데이터 품질</button>
        </nav>

        <div className="filter-title">조회 조건</div>
        <label>기준연도
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label>지역
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>전체</option>
            {regions.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label>설립구분
          <select value={ownership} onChange={(e) => setOwnership(e.target.value)}>
            <option>전체</option>
            {ownerships.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label>학교종류
          <select value={schoolType} onChange={(e) => setSchoolType(e.target.value)}>
            <option>전체</option>
            {schoolTypes.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label>대학명 검색
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 한양대학교" />
        </label>
        <button className="reset" onClick={() => {
          setYear(Math.max(...years)); setRegion("전체"); setOwnership("전체");
          setSchoolType("전체"); setQuery("");
        }}>필터 초기화</button>
      </aside>

      <main>
        <header>
          <div>
            <h1>캡스톤 디자인 운영 대시보드</h1>
            <p>대학별 이수학생·지원금·데이터 품질 통합 분석</p>
          </div>
          <button className="download" onClick={exportCsv}>↓ CSV 다운로드</button>
        </header>

        <div className="filter-summary">
          <span>{year}년</span><span>{region}</span><span>{ownership}</span>
          <b>조회 대학 {current.length}개</b>
        </div>

        {tab === "overview" && (
          <>
            <div className="kpi-grid">
              <KpiCard label="참여 대학 수" value={`${nf.format(current.length)}개`} delta={deltaText(current.length, previous.length)} />
              <KpiCard label="총 이수학생 수" value={`${nf.format(currentStudents)}명`} delta={deltaText(currentStudents, previousStudents)} tone="purple" />
              <KpiCard label="지원금 수령 학생" value={`${nf.format(currentFunded)}명`} delta={deltaText(currentFunded, previousFunded)} tone="orange" />
              <KpiCard label="지원금 수령률" value={formatPct(currentRate)} delta={deltaText(currentRate, previousRate, true)} tone="green" />
              <KpiCard label="총지원금" value={formatWon(currentFund)} delta={deltaText(currentFund, previousFund)} tone="navy" />
              <KpiCard label="수령 학생 1인당" value={formatWon(currentPerPerson)} delta={deltaText(currentPerPerson, previousPerPerson)} tone="cyan" />
            </div>
            <div className="two-grid">
              <TrendChart rows={commonFiltered} />
              <Donut prototype={sum(current, "prototypeFund")} program={sum(current, "programFund")} />
            </div>
            <div className="two-grid">
              <BarChart title={`${year}년 이수학생 상위 대학`} items={topStudents} />
              <BarChart title={`${year}년 총지원금 상위 대학`} items={topFund} color="#0f766e" formatter={formatWon} />
            </div>
          </>
        )}

        {tab === "schools" && (
          <section className="page-section">
            <div className="section-head">
              <div><h2>대학별 상세 현황</h2><p>대학을 선택하여 연도별 학생과 지원금 변화를 확인합니다.</p></div>
              <select className="school-select" value={activeSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
                {schools.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {schoolRows.length > 0 && (
              <>
                <div className="school-banner">
                  <div><span>선택 대학</span><h2>{activeSchool}</h2></div>
                  <div><span>지역</span><b>{schoolRows.at(-1)?.region}</b></div>
                  <div><span>설립구분</span><b>{schoolRows.at(-1)?.ownership}</b></div>
                  <div><span>학교종류</span><b>{schoolRows.at(-1)?.schoolType}</b></div>
                </div>
                <div className="detail-cards">
                  {schoolRows.map((r) => (
                    <article className="year-card" key={r.year}>
                      <h3>{r.year}년</h3>
                      <dl>
                        <div><dt>총 이수학생</dt><dd>{nf.format(r.totalStudents)}명</dd></div>
                        <div><dt>타학과 참여</dt><dd>{nf.format(r.otherStudents)}명</dd></div>
                        <div><dt>수령 학생</dt><dd>{nf.format(r.fundedStudents)}명</dd></div>
                        <div><dt>수령률</dt><dd>{formatPct(r.totalStudents ? r.fundedStudents / r.totalStudents : 0)}</dd></div>
                        <div><dt>총지원금</dt><dd>{formatWon(r.totalFund)}</dd></div>
                        <div><dt>1인당 지원금</dt><dd>{formatWon(r.fundedStudents ? r.totalFund / r.fundedStudents : 0)}</dd></div>
                      </dl>
                    </article>
                  ))}
                </div>
                <section className="panel">
                  <div className="panel-heading"><h3>타학과 계열별 참여</h3><span>선택 대학</span></div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>연도</th><th>인문·사회</th><th>자연과학</th><th>공학</th><th>의학</th><th>예·체능</th><th>합계</th></tr></thead>
                      <tbody>{schoolRows.map((r) => (
                        <tr key={r.year}><td><b>{r.year}</b></td><td>{nf.format(r.otherHumanities)}</td>
                        <td>{nf.format(r.otherScience)}</td><td>{nf.format(r.otherEngineering)}</td>
                        <td>{nf.format(r.otherMedicine)}</td><td>{nf.format(r.otherArts)}</td><td><b>{nf.format(r.otherStudents)}</b></td></tr>
                      ))}</tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </section>
        )}

        {tab === "compare" && (
          <section className="page-section">
            <div className="section-head">
              <div><h2>대학 비교</h2><p>최대 5개 대학을 선택하여 {year}년 핵심지표를 비교합니다.</p></div>
              <span className="selection-count">{compareSchools.length}/5 선택</span>
            </div>
            <div className="compare-layout">
              <div className="school-picker">
                <input placeholder="왼쪽 대학명 검색 필터를 이용하세요" disabled />
                <div>{schools.map((s) => (
                  <label className={compareSchools.includes(s) ? "checked" : ""} key={s}>
                    <input type="checkbox" checked={compareSchools.includes(s)} onChange={() => toggleCompare(s)}
                      disabled={!compareSchools.includes(s) && compareSchools.length >= 5} />
                    <span>{s}</span>
                  </label>
                ))}</div>
              </div>
              <div className="comparison-area">
                {compareSchools.length === 0 ? (
                  <div className="empty">비교할 대학을 선택해 주세요.</div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>대학</th><th>총 이수학생</th><th>수령 학생</th><th>수령률</th><th>총지원금</th><th>1인당 지원금</th></tr></thead>
                      <tbody>{compareSchools.map((school) => {
                        const r = current.find((x) => x.school === school);
                        if (!r) return <tr key={school}><td>{school}</td><td colSpan={5}>해당 연도 데이터 없음</td></tr>;
                        return <tr key={school}><td><b>{school}</b></td><td>{nf.format(r.totalStudents)}명</td>
                          <td>{nf.format(r.fundedStudents)}명</td>
                          <td>{formatPct(r.totalStudents ? r.fundedStudents / r.totalStudents : 0)}</td>
                          <td>{formatWon(r.totalFund)}</td>
                          <td>{formatWon(r.fundedStudents ? r.totalFund / r.fundedStudents : 0)}</td></tr>;
                      })}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {tab === "quality" && (
          <section className="page-section">
            <div className="section-head">
              <div><h2>데이터 품질</h2><p>원본값을 보존하면서 논리 오류와 표준화 필요 항목을 확인합니다.</p></div>
            </div>
            <div className="quality-kpis">
              <KpiCard label="검사 대상" value={`${nf.format(commonFiltered.length)}건`} />
              <KpiCard label="오류" value={`${qualityIssues.filter((x) => x.level === "오류").length}건`} tone="orange" />
              <KpiCard label="경고" value={`${qualityIssues.filter((x) => x.level === "경고").length}건`} tone="purple" />
            </div>
            <section className="panel">
              <div className="panel-heading"><h3>검증 결과</h3><span>총 {qualityIssues.length}건</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>등급</th><th>규칙</th><th>연도</th><th>대학</th><th>지역 원본</th><th>검증 내용</th><th>총지원금</th></tr></thead>
                  <tbody>
                    {qualityIssues.map((x, i) => (
                      <tr key={`${x.rule}-${x.row.school}-${i}`}>
                        <td><span className={`badge ${x.level === "오류" ? "error" : "warning"}`}>{x.level}</span></td>
                        <td>{x.rule}</td><td>{x.row.year}</td><td><b>{x.row.school}</b></td>
                        <td>{x.row.regionRaw}</td><td>{x.message}</td><td>{formatWon(x.row.totalFund)}</td>
                      </tr>
                    ))}
                    {qualityIssues.length === 0 && <tr><td colSpan={7} className="empty-cell">발견된 품질 이슈가 없습니다.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        )}

        <footer>데이터 기준: 업로드된 2024·2025년 캡스톤 디자인 운영 현황 · 원본 지역값 별도 보존</footer>
      </main>
    </div>
  );
}
