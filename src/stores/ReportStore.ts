/**
 * Report Store - Manages reports using Zustand
 * Interacts with repositories for persistence
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { Report } from '@/types/reports';
import { getRepository } from '@/lib/repositories/RepositoryFactory';

interface ReportState {
  reports: Report[];
  unreadCount: number;
  selectedReport: Report | null;
  isLoading: boolean;
  error: string | null;
  loadReports: () => Promise<void>;
  loadUnreadCount: () => Promise<void>;
  getReport: (reportId: string) => Promise<void>;
  createReport: (report: Omit<Report, 'id'>) => Promise<Report | null>;
  markAsRead: (reportId: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  setSelectedReport: (report: Report | null) => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>()(
  devtools(
    (set, get) => ({
      reports: [],
      unreadCount: 0,
      selectedReport: null,
      isLoading: false,
      error: null,
      loadReports: async () => {
        set({ isLoading: true, error: null });
        try {
          const repository = getRepository();
          const reports = await repository.report.getReports();
          set({ reports, isLoading: false });
          await get().loadUnreadCount();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load reports',
            isLoading: false,
          });
        }
      },
      loadUnreadCount: async () => {
        try {
          const repository = getRepository();
          const unreadCount = await repository.report.getUnreadCount();
          set({ unreadCount });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load unread count',
          });
        }
      },
      getReport: async (reportId: string) => {
        set({ isLoading: true, error: null });
        try {
          const repository = getRepository();
          const report = await repository.report.getReport(reportId);
          set({ selectedReport: report, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load report',
            isLoading: false,
          });
        }
      },
      createReport: async (reportData: Omit<Report, 'id'>) => {
        try {
          const repository = getRepository();
          const report = await repository.report.createReport(reportData);
          set((state) => ({
            reports: [report, ...state.reports],
            unreadCount: state.unreadCount + (report.read ? 0 : 1),
          }));
          return report;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create report',
          });
          return null;
        }
      },
      markAsRead: async (reportId: string) => {
        try {
          const repository = getRepository();
          await repository.report.markReportAsRead(reportId);
          set((state) => ({
            reports: state.reports.map((report) =>
              report.id === reportId ? { ...report, read: true } : report,
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
            selectedReport:
              state.selectedReport?.id === reportId
                ? { ...state.selectedReport, read: true }
                : state.selectedReport,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to mark report as read',
          });
        }
      },
      deleteReport: async (reportId: string) => {
        try {
          const repository = getRepository();
          const report = get().reports.find((item) => item.id === reportId);
          await repository.report.deleteReport(reportId);
          set((state) => ({
            reports: state.reports.filter((item) => item.id !== reportId),
            unreadCount: !report?.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
            selectedReport: state.selectedReport?.id === reportId ? null : state.selectedReport,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete report',
          });
        }
      },
      setSelectedReport: (report: Report | null) => {
        set({ selectedReport: report });
      },
      reset: () => {
        set({
          reports: [],
          unreadCount: 0,
          selectedReport: null,
          isLoading: false,
          error: null,
        });
      },
    }),
    { name: 'ReportStore' },
  ),
);
