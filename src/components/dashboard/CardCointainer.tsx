import { Grid } from "@mui/material";
import DashboardCard from "./DashboardCard";

export default function CardContainer ({
  isViaje, 
  viajeCantidadTotal, 
  viajeInicioCarga, 
  viajeEnCamino, 
  viajeFinalizado,
  
  remitoCantidadTotal,
  remitoEnCamino,
  remitoEntregados,
  remitoNoEntregados,
}: {
  isViaje: boolean, 
  viajeCantidadTotal?: number,
  viajeInicioCarga?: number,
  viajeEnCamino?: number,
  viajeFinalizado?: number,

  remitoCantidadTotal?: number,
  remitoEnCamino?: number,
  remitoEntregados?: number,
  remitoNoEntregados?: number,
}) {

  return (
    <div>
      { isViaje ? (
      <Grid container mb={2} spacing={1} paddingLeft={3} paddingRight={3} paddingTop={2} paddingBottom={2}>
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="Cantidad total"
            count={viajeCantidadTotal || 0}
            backgroundColor="#ffffff"
            textColor="#605D5D"
            link={{
              pathname: "/trips/distribution"
            }}
          />
        </Grid>
        
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="Inicio de carga"
            count={viajeInicioCarga || 0}
            backgroundColor="#5192FB"
            textColor="#ffffff"
            link={{
              pathname: "/trips/distribution",
              state: { defaultFilter: { estado: "inicio de carga" } }
            }}
          />
        </Grid>                          
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="En camino"
            count={viajeEnCamino || 0}
            backgroundColor="#FF9247"
            textColor="#ffffff"
            link={{
              pathname: "/trips/distribution",
              state: { defaultFilter: { estado: "fin de carga" } }
            }}
          />
        </Grid>
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="Finalizado"
            count={viajeFinalizado || 0}
            backgroundColor="#9699A1"
            textColor="#ffffff"
            link={{
              pathname: "/trips/distribution",
              state: { defaultFilter: { estado: "fin de viaje" } }
            }}
          />
        </Grid>
      </Grid>
        
      ) : (

      <Grid container mb={2} spacing={1} paddingLeft={3} paddingRight={3} paddingTop={2} paddingBottom={2}>
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="Cantidad total"
            count={remitoCantidadTotal || 0}
            backgroundColor="#ffffff"
            textColor="#605D5D"
            link={buildRemitosUrl({ fechaDesde: new Date(), fechaHasta: new Date() })}
            external={true}
          />
        </Grid>
        
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="En camino"
            count={remitoEnCamino || 0}
            backgroundColor="#FF9247"
            textColor="#ffffff"
            link={buildRemitosUrl({ fechaDesde: new Date(), fechaHasta: new Date(), estadoId: 4 })}
            external={true}
          />
        </Grid>                          
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="Entregados"
            count={remitoEntregados || 0}
            backgroundColor="#23A26D"
            textColor="#ffffff"
          />
        </Grid>
        <Grid item xs={12}  lg={6} >
          <DashboardCard
            title="No entregados"
            count={remitoNoEntregados || 0}
            backgroundColor="#FF4443"
            textColor="#ffffff"
          />
        </Grid>
      </Grid>
      )
      }
    </div>
  );
}

interface RemitosFilters {
  fechaDesde: Date;
  fechaHasta: Date;
  estadoId?: number; // opcional, porque uno de tus links no tiene estadoId
  page?: number;
  limit?: number;
}

function buildRemitosUrl(filters: RemitosFilters) {
  const { fechaDesde, fechaHasta, estadoId, page = 1, limit = 1000 } = filters;

  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (estadoId) params.append('estadoId', estadoId.toString());

  // Convertimos a YYYY-MM-DD para que el backend lo entienda
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  params.append('fechaDesde', formatDate(fechaDesde));
  params.append('fechaHasta', formatDate(fechaHasta));

  return `https://remitos-front.netlify.app/remitos?${params.toString()}`;
}