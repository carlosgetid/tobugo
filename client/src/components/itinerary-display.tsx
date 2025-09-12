import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CostSummary from "@/components/cost-summary";
import { Edit, Download, Calendar, MapPin, Plane, Bed, Utensils, Car, Send } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";

interface ItineraryDisplayProps {
  itinerary: any;
  onModify: (feedback: string) => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'flight':
      return <Plane className="h-5 w-5" />;
    case 'accommodation':
      return <Bed className="h-5 w-5" />;
    case 'meal':
      return <Utensils className="h-5 w-5" />;
    case 'transport':
      return <Car className="h-5 w-5" />;
    case 'activity':
    default:
      return <MapPin className="h-5 w-5" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'flight':
      return 'bg-primary';
    case 'accommodation':
      return 'bg-secondary';
    case 'meal':
      return 'bg-accent';
    case 'transport':
      return 'bg-secondary';
    case 'activity':
    default:
      return 'bg-accent';
  }
};

export default function ItineraryDisplay({ itinerary, onModify }: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));
  const [modificationText, setModificationText] = useState("");
  const [isModificationDialogOpen, setIsModificationDialogOpen] = useState(false);

  const toggleDay = (index: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDays(newExpanded);
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(itinerary);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleSendModification = () => {
    if (modificationText.trim()) {
      onModify(modificationText);
      setModificationText("");
      setIsModificationDialogOpen(false);
    }
  };

  if (!itinerary || !itinerary.days) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se pudo cargar el itinerario.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-itinerary-header">
            Tu Itinerario Personalizado
          </h2>
          <p className="text-muted-foreground">
            {itinerary.days?.length} días • ${itinerary.totalCost?.toLocaleString()} total
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isModificationDialogOpen} onOpenChange={setIsModificationDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                data-testid="button-modify-itinerary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modificar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modificar Itinerario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  Describe los cambios que te gustaría hacer a tu itinerario:
                </p>
                <Input
                  placeholder="Ej: Me gustaría añadir más tiempo en el museo y visitar un restaurante local"
                  value={modificationText}
                  onChange={(e) => setModificationText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendModification()}
                  data-testid="input-modification-text"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsModificationDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSendModification}
                    disabled={!modificationText.trim()}
                    data-testid="button-send-modification"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Cambios
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            onClick={handleDownloadPDF}
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* Itinerary Days */}
      <div className="space-y-6">
        {itinerary.days?.map((day: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleDay(index)}
              data-testid={`header-day-${index}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">
                      Día {index + 1} - {day.activities?.[0]?.title || 'Actividades del día'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${day.totalCost?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-muted-foreground">
                    {expandedDays.has(index) ? 'Contraer' : 'Expandir'}
                  </p>
                </div>
              </div>
            </CardHeader>

            {expandedDays.has(index) && (
              <CardContent className="space-y-4">
                {day.activities?.map((activity: any, actIndex: number) => (
                  <div
                    key={actIndex}
                    className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
                    data-testid={`activity-${index}-${actIndex}`}
                  >
                    <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center text-white`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium" data-testid={`text-activity-title-${index}-${actIndex}`}>
                        {activity.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.time} {activity.location && ` • ${activity.location}`}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1" data-testid={`text-activity-description-${index}-${actIndex}`}>
                          {activity.description}
                        </p>
                      )}
                    </div>
                    {activity.cost && (
                      <div className="text-right">
                        <p className="font-medium text-primary" data-testid={`text-activity-cost-${index}-${actIndex}`}>
                          ${activity.cost}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {activity.type === 'accommodation' ? 'Por noche' : 'Estimado'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Day Total */}
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-medium">Total del día</span>
                  <span className="text-lg font-bold text-primary" data-testid={`text-day-total-${index}`}>
                    ${day.totalCost?.toLocaleString() || '0'}
                  </span>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Show more days button if some are collapsed */}
        {itinerary.days?.length > 3 && expandedDays.size < itinerary.days.length && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setExpandedDays(new Set(Array.from({ length: itinerary.days.length }, (_, i) => i)))}
              data-testid="button-show-all-days"
            >
              Ver todos los días ({itinerary.days.length - expandedDays.size} restantes)
            </Button>
          </div>
        )}
      </div>

      {/* Cost Summary */}
      <CostSummary
        totalCost={itinerary.totalCost}
        costBreakdown={itinerary.costBreakdown}
        days={itinerary.days?.length || 0}
      />
    </div>
  );
}
