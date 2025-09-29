import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  User,
  Key
} from 'lucide-react';
import { progressApi } from '@/services/progressApi';
import { useToast } from '@/hooks/use-toast';

export const ProgressDebugger: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runTests = async () => {
    setIsRunning(true);
    const results: Record<string, any> = {};

    // Test 1: Check authentication
    try {
      const token = localStorage.getItem('authToken');
      results.auth = {
        status: 'success',
        message: token ? 'Token found' : 'No token found',
        token: token ? `${token.substring(0, 20)}...` : null
      };
    } catch (error) {
      results.auth = {
        status: 'error',
        message: 'Error checking auth',
        error: error
      };
    }

    // Test 2: Test progress report API
    try {
      const report = await progressApi.getProgressReport('week');
      results.progressReport = {
        status: 'success',
        message: 'Progress report loaded successfully',
        data: report
      };
    } catch (error: any) {
      results.progressReport = {
        status: 'error',
        message: error.message || 'Failed to load progress report',
        error: error
      };
    }

    // Test 3: Test daily needs API
    try {
      const dailyNeeds = await progressApi.getDailyNeeds();
      results.dailyNeeds = {
        status: 'success',
        message: 'Daily needs loaded successfully',
        data: dailyNeeds
      };
    } catch (error: any) {
      results.dailyNeeds = {
        status: 'error',
        message: error.message || 'Failed to load daily needs',
        error: error
      };
    }

    // Test 4: Test recommended activities API
    try {
      const activities = await progressApi.getRecommendedActivities();
      results.recommendedActivities = {
        status: 'success',
        message: 'Recommended activities loaded successfully',
        data: activities
      };
    } catch (error: any) {
      results.recommendedActivities = {
        status: 'error',
        message: error.message || 'Failed to load recommended activities',
        error: error
      };
    }

    // Test 5: Test mock data
    try {
      const mockData = await progressApi.getMockProgressReport();
      results.mockData = {
        status: 'success',
        message: 'Mock data loaded successfully',
        data: mockData
      };
    } catch (error: any) {
      results.mockData = {
        status: 'error',
        message: error.message || 'Failed to load mock data',
        error: error
      };
    }

    setTestResults(results);
    setIsRunning(false);

    toast({
      title: "تم تشغيل الاختبارات",
      description: "تم فحص جميع نقاط API. تحقق من النتائج أدناه.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-primary" />
          أداة تشخيص Progress API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="bg-gradient-primary"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                جاري التشغيل...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 ml-2" />
                تشغيل الاختبارات
              </>
            )}
          </Button>
          
          <div className="text-sm text-gray-600">
            هذه الأداة تختبر جميع نقاط API لتحديد سبب عدم ظهور البيانات
          </div>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">نتائج الاختبارات:</h4>
            
            {Object.entries(testResults).map(([testName, result]) => (
              <Card key={testName} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium capitalize">
                        {testName === 'auth' ? 'المصادقة' :
                         testName === 'progressReport' ? 'تقرير التقدم' :
                         testName === 'dailyNeeds' ? 'الاحتياجات اليومية' :
                         testName === 'recommendedActivities' ? 'الأنشطة المقترحة' :
                         testName === 'mockData' ? 'البيانات التجريبية' : testName}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(result.status)}
                    >
                      {result.status === 'success' ? 'نجح' : 'فشل'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                  
                  {testName === 'auth' && result.token && (
                    <div className="text-xs text-gray-500">
                      <User className="w-3 h-3 inline ml-1" />
                      Token: {result.token}
                    </div>
                  )}
                  
                  {result.error && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-600 cursor-pointer">
                        عرض تفاصيل الخطأ
                      </summary>
                      <pre className="text-xs bg-red-50 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs text-green-600 cursor-pointer">
                        عرض البيانات المستلمة
                      </summary>
                      <pre className="text-xs bg-green-50 p-2 rounded mt-1 overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">نصائح لحل المشاكل:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• تأكد من تسجيل الدخول وإنشاء ملفك الشخصي أولاً</li>
            <li>• تحقق من اتصال الإنترنت</li>
            <li>• إذا فشلت جميع API، سيتم استخدام البيانات التجريبية</li>
            <li>• تحقق من وحدة التحكم في المتصفح لتفاصيل أكثر</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
