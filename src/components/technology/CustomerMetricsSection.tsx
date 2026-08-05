import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import TranslatableText from '@/components/translation/TranslatableText';

const trafficData = [
  { hour: '6a', visitors: 12 },
  { hour: '7a', visitors: 28 },
  { hour: '8a', visitors: 46 },
  { hour: '9a', visitors: 38 },
  { hour: '10a', visitors: 31 },
  { hour: '11a', visitors: 52 },
  { hour: '12p', visitors: 88 },
  { hour: '1p', visitors: 76 },
  { hour: '2p', visitors: 44 },
  { hour: '3p', visitors: 39 },
  { hour: '4p', visitors: 47 },
  { hour: '5p', visitors: 68 },
  { hour: '6p', visitors: 72 },
  { hour: '7p', visitors: 55 },
  { hour: '8p', visitors: 34 },
  { hour: '9p', visitors: 21 },
  { hour: '10p', visitors: 11 },
];

const chartConfig = {
  visitors: {
    label: 'Customers',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const CustomerMetricsSection: React.FC = () => {
  return (
    <section
      id="customer-metrics"
      className="py-16 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="customer-metrics-heading"
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Graphic - left */}
          <div className="w-full md:w-1/2">
            <Card className="rounded-lg shadow-xl">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground mb-4">
                  <TranslatableText context="technology-page">Customer Traffic by Hour</TranslatableText>
                </p>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <BarChart data={trafficData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval="preserveStartEnd"
                      minTickGap={12}
                    />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Copy - right */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-4">
              <h2 id="customer-metrics-heading" className="text-3xl font-bold tracking-tight">
                <TranslatableText context="technology-page">Customer Metrics</TranslatableText>
              </h2>
              <p className="text-lg text-muted-foreground">
                <TranslatableText context="technology-page">
                  Anonymized, on-device customer counts reveal when your machines are busiest — so you can stock, price, and staff around real demand.
                </TranslatableText>
              </p>
              <p className="text-base text-muted-foreground">
                <TranslatableText context="technology-page">
                  Illustrative data. Traffic is measured anonymously in aggregate — no personally identifiable information is collected or stored.
                </TranslatableText>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default CustomerMetricsSection;
