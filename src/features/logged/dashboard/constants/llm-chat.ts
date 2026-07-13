/** 어떤 질문이 와도 순서대로 하나씩 돌려주는 가짜 응답 풀 */
export const FAKE_LLM_RESPONSES: string[] = [
  'Digital Twin AI ready. I have full visibility into all vessels, blocks, and work orders. Block 502 (Vessel 2585-LNG · Maran Gas) is flagged with a weld inspection pending. Completion is at 78% — ETA to Phase 3 handoff is approximately 3.4 days.',
  'Equipment utilization for 2585-LNG: • Gantry Crane #3 — 91% (overloaded) • Mobile Crane #7 — 64% • Blasting Unit #2 — 38% (standby)  Recommend redistributing Crane #3 load to Mobile Crane #7 to reduce fatigue risk.',
  'Block 4074-50A-502 is in 선각 대조립 at 75% progress. Next milestone: 선행 도장 handoff scheduled for 07/15. Workfront checks are all green except 선행 검사 (HOLD — approval pending).',
  'CCTV-C ZONE currently has 1 active safety alarm (PPE violation, danger level: HIGH). Nearest safety officer is 240m away — I recommend dispatching them now.',
  'Yard E-2 staging area is at 68% capacity with Block 4074-50A-502 (145 Ton) placed since 05/28. Outbound transfer to the paint shop is planned for 06/15.',
  "Today's production achievement is 92% against a 100% target. Steel cutting is ahead of plan (+2.1%), while block assembly is trailing by 1.4 days due to crane contention.",
  'Goliath Crane GC-101 shows an emergency stop event at 16:40. Diagnostics indicate a limit-switch fault; maintenance ticket WO-2841 has been auto-generated.',
  'Weather outlook for the yard: NE wind 6 m/s, gusts to 11 m/s after 15:00. Crane operations above 40m should be rescheduled to the morning window.',
]
