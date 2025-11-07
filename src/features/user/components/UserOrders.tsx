import React, { useState } from 'react';
import { Package, Calendar, CreditCard, Eye, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useApp } from '@/shared/contexts/AppContext';
import type { Order } from '@/features/orders/types';
import { getStatusColor } from './order-details/orderDetailsUtils';

interface UserOrdersProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export const UserOrders: React.FC<UserOrdersProps> = ({ orders, isLoading, error }) => {
  const { t: featureT } = useFeatureTranslations("user");
  const { isRTL } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: featureT("orderDetailsModal.status.pending"),
      processing: featureT("orderDetailsModal.status.processing"),
      shipped: featureT("orderDetailsModal.status.shipped"),
      delivered: featureT("orderDetailsModal.status.delivered"),
      cancelled: featureT("orderDetailsModal.status.cancelled"),
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (isLoading) {
        return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Package className="h-6 w-6 text-amber-600" />
            {featureT("userOrders.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
        return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Package className="h-6 w-6 text-amber-600" />
            {featureT("userOrders.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">
              {featureT("userOrders.error")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {featureT("userOrders.errorDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

    return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Package className="h-6 w-6 text-amber-600" />
          {featureT("userOrders.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!Array.isArray(orders) || orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {featureT("userOrders.noOrders")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Filter Tabs */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/30">
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {featureT("userOrders.filterOrders")}
                </h3>
              </div>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className={`grid w-full grid-cols-4 ${isRTL ? '[direction:rtl]' : ''} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm`}>
                  <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                    {featureT("userOrders.all")}
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
                    {featureT("userOrders.pending")}
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
                    {featureT("userOrders.processing")}
                  </TabsTrigger>
                  <TabsTrigger value="delivered" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                    {featureT("userOrders.delivered")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {Array.isArray(orders) && orders.filter(order => selectedTab === 'all' || order.status.toLowerCase() === selectedTab).map((order) => (
                <Card key={order.orderNumber} className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className="font-semibold">#{order.orderNumber}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <CreditCard className="h-4 w-4" />
                            <span>${order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {featureT("userOrders.viewDetails")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
                <TabsContent value="pending" className="space-y-4 mt-6">
                  {Array.isArray(orders) && orders.filter(order => order.status.toLowerCase() === 'pending').map((order) => (
                <Card key={order.orderNumber} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className="font-semibold">#{order.orderNumber}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <CreditCard className="h-4 w-4" />
                            <span>${order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {featureT("userOrders.viewDetails")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
                <TabsContent value="processing" className="space-y-4 mt-6">
                  {Array.isArray(orders) && orders.filter(order => order.status.toLowerCase() === 'processing').map((order) => (
                <Card key={order.orderNumber} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className="font-semibold">#{order.orderNumber}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <CreditCard className="h-4 w-4" />
                            <span>${order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {featureT("userOrders.viewDetails")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
                <TabsContent value="delivered" className="space-y-4 mt-6">
                  {Array.isArray(orders) && orders.filter(order => order.status.toLowerCase() === 'delivered').map((order) => (
                <Card key={order.orderNumber} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className="font-semibold">#{order.orderNumber}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <CreditCard className="h-4 w-4" />
                            <span>${order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {featureT("userOrders.viewDetails")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Card>
  );
}