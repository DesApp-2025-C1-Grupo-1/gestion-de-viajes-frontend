import { ViajeDistribucionDto } from "../../api/generated";
import { TripDistributionType } from "../../components/TripDistributionType";

import { SectionHeader } from "../../components/SectionHeader";
import { useEffect, useState } from "react";
import { Box, Popover, Typography } from "@mui/material";

import { useParams } from 'react-router-dom';


export default function DistributionDetailsPage() {
    const {id} = useParams();

    return (
         <>
        <div style={{ padding: '2rem' }}>
        <h2>Detalles del viaje</h2>
        <p>Estás viendo la página de detalles para el viaje seleccionado.</p>
        </div>
        </>
    )
}


