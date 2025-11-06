import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { generatePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface Purchase {
  id: string;
  tripId: string;
  amount: string;
  currency: string;
  status: string;
  createdAt: string;
  paidAt?: string;
  trip?: {
    id: string;
    title: string;
    destination: string;
    itinerary: any;
  };
}

export default function PurchaseHistory() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: purchases, isLoading } = useQuery<Purchase[]>({
    queryKey: ["/api/payments/history"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200" data-testid={`badge-status-approved`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200" data-testid={`badge-status-pending`}>
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "rejected":
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200" data-testid={`badge-status-rejected`}>
            <XCircle className="h-3 w-3 mr-1" />
            {status === "rejected" ? "Rechazado" : "Cancelado"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" data-testid={`badge-status-unknown`}>
            <AlertCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const handleDownloadPDF = async (purchase: Purchase) => {
    if (!purchase.trip?.itinerary) {
      toast({
        title: "Error",
        description: "No se pudo encontrar el itinerario",
        variant: "destructive",
      });
      return;
    }

    try {
      await generatePDF(purchase.trip.itinerary);
      toast({
        title: "PDF descargado",
        description: "Tu itinerario se descargó correctamente",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error al generar PDF",
        description: "No se pudo generar el archivo",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <Card data-testid="card-no-purchases">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
              <DollarSign className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No tienes compras aún</h3>
          <p className="text-muted-foreground mb-6">
            Cuando compres un itinerario para descargar, aparecerá aquí
          </p>
          <Button onClick={() => setLocation("/chat")} data-testid="button-create-new-trip">
            Comenzar a Planificar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-purchase-history-title">
            Historial de Compras
          </h2>
          <p className="text-muted-foreground">
            {purchases.length} {purchases.length === 1 ? "compra" : "compras"} en total
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Card key={purchase.id} data-testid={`card-purchase-${purchase.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2" data-testid={`text-trip-title-${purchase.id}`}>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {purchase.trip?.title || "Itinerario"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(purchase.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                    {purchase.trip?.destination && (
                      <span className="text-xs" data-testid={`text-destination-${purchase.id}`}>
                        {purchase.trip.destination}
                      </span>
                    )}
                  </CardDescription>
                </div>
                {getStatusBadge(purchase.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Monto pagado</p>
                  <p className="text-2xl font-bold" data-testid={`text-amount-${purchase.id}`}>
                    ${purchase.amount} {purchase.currency}
                  </p>
                  {purchase.paidAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Pagado el {new Date(purchase.paidAt).toLocaleDateString("es-ES")}
                    </p>
                  )}
                </div>
                
                {purchase.status === "approved" && purchase.trip?.itinerary && (
                  <Button
                    onClick={() => handleDownloadPDF(purchase)}
                    data-testid={`button-download-${purchase.id}`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                )}
                
                {purchase.status === "pending" && (
                  <Button variant="outline" disabled data-testid={`button-pending-${purchase.id}`}>
                    <Clock className="h-4 w-4 mr-2" />
                    En Proceso
                  </Button>
                )}
                
                {(purchase.status === "rejected" || purchase.status === "cancelled") && (
                  <Button
                    variant="outline"
                    onClick={() => setLocation(`/itinerarios?tripId=${purchase.tripId}`)}
                    data-testid={`button-retry-${purchase.id}`}
                  >
                    Intentar de Nuevo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
