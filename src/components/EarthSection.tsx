import { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface EpicImage {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  coords: {
    centroid_coordinates: {
      lat: number;
      lon: number;
    };
  };
}

const EarthSection = () => {
  const [epicImages, setEpicImages] = useState<EpicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const fetchEpicImages = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=WpmHNsPq2Mrunu1I9sTBjTsZ7BM7lqIngucQsqVL`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch EPIC images');
      }
      
      const data = await response.json();
      setEpicImages(data);
    } catch (error) {
      console.error('Error fetching EPIC images:', error);
      toast({
        title: "Error",
        description: "Failed to load Earth images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpicImages(selectedDate);
  }, [selectedDate]);

  const getImageUrl = (image: EpicImage) => {
    const dateParts = image.date.split(' ')[0].split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/${image.image}.png?api_key=WpmHNsPq2Mrunu1I9sTBjTsZ7BM7lqIngucQsqVL`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Date Selector */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="text-primary" />
            Select Date for Earth Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min="2015-06-13"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
          />
          <p className="text-white/60 text-sm mt-2">
            Images are captured by NASA's EPIC camera aboard the DSCOVR satellite
          </p>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {epicImages.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-white/70">No Earth images available for this date.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {epicImages.map((image) => (
            <Card key={image.identifier} className="glass-card overflow-hidden group hover:space-glow transition-all duration-300">
              <div className="aspect-square overflow-hidden">
                <img
                  src={getImageUrl(image)}
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <ImageIcon size={16} />
                    <span className="text-sm font-medium">EPIC</span>
                  </div>
                  <p className="text-white/90 text-sm">{image.caption}</p>
                  <div className="text-white/70 text-xs">
                    <p>Lat: {image.coords.centroid_coordinates.lat.toFixed(2)}°</p>
                    <p>Lon: {image.coords.centroid_coordinates.lon.toFixed(2)}°</p>
                  </div>
                  <p className="text-white/60 text-xs">{new Date(image.date).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EarthSection;
