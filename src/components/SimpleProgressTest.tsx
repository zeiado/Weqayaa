import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Code
} from 'lucide-react';
import { progressApi } from '@/services/progressApi';
import { useToast } from '@/hooks/use-toast';

export const SimpleProgressTest: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const { toast } = useToast();

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      console.log('Starting progress API test...');
      
      // Test 1: Try real API
      try {
        console.log('Testing real API...');
        const realData = await progressApi.getProgressReport('week');
        setTestResult({
          type: 'success',
          source: 'real_api',
          message: 'Real API worked successfully!',
          data: realData
        });
        toast({
          title: "نجح API الحقيقي! ✅",
          description: "تم تحميل البيانات من الخادم بنجاح",
        });
        return;
      } catch (realError: any) {
        console.log('Real API failed:', realError);
        
        // Test 2: Try mock data
        try {
          console.log('Testing mock data...');
          const mockData = await progressApi.getMockProgressReport();
          setTestResult({
            type: 'warning',
            source: 'mock_data',
            message: 'Real API failed, but mock data works',
            realError: realError.message,
            data: mockData
          });
          toast({
            title: "API الحقيقي فشل، لكن البيانات التجريبية تعمل",
            description: "يتم استخدام البيانات التجريبية كبديل",
            variant: "default",
          });
          return;
        } catch (mockError: any) {
          console.log('Mock data also failed:', mockError);
          setTestResult({
            type: 'error',
            source: 'both_failed',
            message: 'Both real API and mock data failed',
            realError: realError.message,
            mockError: mockError.message
          });
          toast({
            title: "فشل كل من API والبيانات التجريبية",
            description: "تحقق من وحدة التحكم للتفاصيل",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Test failed completely:', error);
      setTestResult({
        type: 'error',
        source: 'test_error',
        message: 'Test itself failed',
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case 'success':
        return 'نجح';
      case 'warning':
        return 'تحذير';
      case 'error':
        return 'فشل';
      default:
        return 'غير معروف';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          اختبار بسيط لـ Progress API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={runTest} 
            disabled={isLoading}
            className="bg-gradient-primary"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                جاري الاختبار...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 ml-2" />
                تشغيل الاختبار
              </>
            )}
          </Button>
          
          <div className="text-sm text-gray-600">
            اختبار سريع لمعرفة ما إذا كان API يعمل أم لا
          </div>
        </div>

        {testResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">نتيجة الاختبار:</h4>
              <Badge 
                variant="outline" 
                className={getStatusColor(testResult.type)}
              >
                {getStatusText(testResult.type)}
              </Badge>
            </div>
            
            <Card className="border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getStatusIcon(testResult.type)}
                  <span className="font-medium">{testResult.message}</span>
                </div>
                
                {testResult.source === 'real_api' && (
                  <div className="text-sm text-green-600">
                    ✅ API الحقيقي يعمل بشكل مثالي!
                  </div>
                )}
                
                {testResult.source === 'mock_data' && (
                  <div className="space-y-2">
                    <div className="text-sm text-yellow-600">
                      ⚠️ API الحقيقي فشل، لكن البيانات التجريبية تعمل
                    </div>
                    {testResult.realError && (
                      <div className="text-xs text-red-500">
                        خطأ API: {testResult.realError}
                      </div>
                    )}
                  </div>
                )}
                
                {testResult.source === 'both_failed' && (
                  <div className="space-y-2">
                    <div className="text-sm text-red-600">
                      ❌ فشل كل من API والبيانات التجريبية
                    </div>
                    {testResult.realError && (
                      <div className="text-xs text-red-500">
                        خطأ API: {testResult.realError}
                      </div>
                    )}
                    {testResult.mockError && (
                      <div className="text-xs text-red-500">
                        خطأ البيانات التجريبية: {testResult.mockError}
                      </div>
                    )}
                  </div>
                )}
                
                {testResult.data && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRawData(!showRawData)}
                      >
                        {showRawData ? <Eye className="w-4 h-4 ml-1" /> : <Code className="w-4 h-4 ml-1" />}
                        {showRawData ? 'إخفاء' : 'عرض'} البيانات الخام
                      </Button>
                    </div>
                    
                    {showRawData && (
                      <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-60">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">ماذا يعني هذا:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>نجح:</strong> API يعمل بشكل مثالي، لا توجد مشاكل</li>
            <li>• <strong>تحذير:</strong> API فشل لكن البيانات التجريبية تعمل (مشكلة في الخادم)</li>
            <li>• <strong>فشل:</strong> مشكلة في الكود أو البيانات التجريبية</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
