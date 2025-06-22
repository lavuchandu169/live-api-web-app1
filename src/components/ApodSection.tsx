
import { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ApodData {
  title: string;
  date: string;
  explanation: string;
  url: string;
  media_type: string;
  hdurl?: string;
}

const ApodSection = () => {
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const fetchApod = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=WpmHNsPq2Mrunu1I9sTBjTsZ7BM7lqIngucQsqVL&date=${date}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch APOD data');
      }
      
      const data = await response.json();
      setApodData(data);
    } catch (error) {
      console.error('Error fetching APOD:', error);
      toast({
        title: "Error",
        description: "Failed to load astronomy picture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApod(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!apodData) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">No astronomy picture available for this date.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Date Selector */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="text-primary" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            min="1995-06-16"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </CardContent>
      </Card>

      {/* APOD Display */}
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-white flex items-center gap-3">
            <ImageIcon className="text-primary" />
            {apodData.title}
          </CardTitle>
          <p className="text-white/70 text-lg">{apodData.date}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {apodData.media_type === 'image' ? (
            <div className="relative group">
              <img
                src={apodData.url}
                alt={apodData.title}
                className="w-full h-auto rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              {apodData.hdurl && (
                <Button
                  onClick={() => window.open(apodData.hdurl, '_blank')}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                >
                  View HD
                </Button>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={apodData.url}
                title={apodData.title}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
          
          <div className="prose prose-invert max-w-none">
            <p className="text-white/90 leading-relaxed text-lg">
              {apodData.explanation}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApodSection;
