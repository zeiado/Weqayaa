import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardApi } from "@/services/dashboardApi";
import { StatisticsPeriod, UserStatisticsResponse } from "@/types/dashboard";

export const StatisticsView: React.FC = () => {
  const [period, setPeriod] = useState<StatisticsPeriod>('week');
  const [stats, setStats] = useState<UserStatisticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardApi.getUserStatistics(period);
        setStats(data);
      } catch (e: any) {
        setError(e?.message || 'فشل تحميل الإحصائيات');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>الإحصائيات والإنجازات</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as StatisticsPeriod)}>
          <TabsList>
            <TabsTrigger value="week">أسبوع</TabsTrigger>
            <TabsTrigger value="month">شهر</TabsTrigger>
            <TabsTrigger value="quarter">ربع</TabsTrigger>
          </TabsList>
          <TabsContent value={period} className="space-y-6">
            {loading && <div className="text-muted-foreground">جاري التحميل...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {stats && !loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">المواظبة (أيام متتالية)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.streakDays}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">وجبات مسجلة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMealsLogged}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">معدل تحقيق الأهداف</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.goalAchievementRate}%</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {stats && !loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">المتوسطات اليومية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>السعرات: <span className="font-semibold">{stats.averageCaloriesPerDay}</span></div>
                    <div>البروتين: <span className="font-semibold">{stats.averageProteinPerDay}g</span></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">التقدم الأسبوعي</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>تغير الوزن: <span className="font-semibold">{stats.weeklyProgress.weightChange}</span> كجم</div>
                    <div>اتساق السعرات: <span className="font-semibold">{stats.weeklyProgress.calorieConsistency}%</span></div>
                    <div>اتساق البروتين: <span className="font-semibold">{stats.weeklyProgress.proteinConsistency}%</span></div>
                  </CardContent>
                </Card>
              </div>
            )}

            {stats && stats.achievements?.length > 0 && (
              <div className="space-y-2">
                <div className="font-semibold">الإنجازات</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stats.achievements.map((ach) => (
                    <Card key={ach.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{ach.icon || '🏅'}</div>
                        <div>
                          <div className="font-semibold">{ach.title}</div>
                          <div className="text-xs text-foreground/70">{ach.description}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


