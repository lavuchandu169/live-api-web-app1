
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface NeoObject {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

interface NeoData {
  near_earth_objects: Record<string, NeoObject[]>;
  element_count: number;
}

const NeoSection = () => {
  const [neoData, setNeoData] = useState<NeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const fetchNeoData = async (startDate: string) => {
    setLoading(true);
    try {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate.toISOString().split('T')[0]}&api_key=WpmHNsPq2Mrunu1I9sTBjTsZ7BM7lqIngucQsqVL`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch NEO data');
      }
      
      const data = await response.json();
      setNeoData(data);
    } catch (error) {
      console.error('Error fetching NEO data:', error);
      toast({
        title: "Error",
        description: "Failed to load near-Earth object data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeoData(selectedDate);
  }, [selectedDate]);

  const chartData = neoData ? Object.entries(neoData.near_earth_objects).map(([date, objects]) => ({
    date: new Date(date).toLocaleDateString(),
    count: objects.length,
    hazardous: objects.filter(obj => obj.is_potentially_hazardous_asteroid).length
  })) : [];

  const allObjects = neoData ? Object.values(neoData.near_earth_objects).flat() : [];

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
            Select Week Starting Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
          />
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{neoData?.element_count || 0}</div>
            <p className="text-white/90">Total Objects</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {allObjects.filter(obj => obj.is_potentially_hazardous_asteroid).length}
            </div>
            <p className="text-white/90">Potentially Hazardous</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {allObjects.length - allObjects.filter(obj => obj.is_potentially_hazardous_asteroid).length}
            </div>
            <p className="text-white/90">Safe Objects</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Daily Near-Earth Object Count</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="count" fill="#22c55e" />
              <Bar dataKey="hazardous" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Object List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="text-primary" />
            Near-Earth Objects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {allObjects.slice(0, 10).map((object) => (
              <div key={object.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{object.name}</h3>
                  {object.is_potentially_hazardous_asteroid && (
                    <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded-full">
                      Potentially Hazardous
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-white/70">
                  <div>
                    Diameter: {object.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} - {object.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
                  </div>
                  {object.close_approach_data[0] && (
                    <>
                      <div>
                        Speed: {parseFloat(object.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h
                      </div>
                      <div>
                        Miss Distance: {parseFloat(object.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NeoSection;
