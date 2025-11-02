import { Card, Typography, Box, Stack, Skeleton } from "@mui/material";
import { ReactNode } from 'react';
import { RemitoDto, ViajeDistribucionDto } from "../../api/generated";
import { AnimatePresence, motion } from "framer-motion";

interface InfoCardProps {
    title: string;
    description?: string;
    subDescription?: number;
    icon: ReactNode;
    value?: number;
    list?: ViajeDistribucionDto[];
    listRemitos?: RemitoDto[];
    link?: string;
    external?: boolean; // nuevo flag
    loading?: boolean;
    isList?: boolean;
    children?: ReactNode;
}

export const InfoCard = ({
  title,
  icon,
  loading = false,
  isList = false,
  children
}: InfoCardProps) => {

    return(
        <Card className="h-full">
            <Box display="flex" alignItems="center" justifyContent="space-between" paddingTop={3} paddingLeft={3}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    {icon}
                    <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                        {title}
                    </Typography>
                </Stack>
            </Box>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center" padding={isList ? 2 : 3} pt={isList ? 0 : 3} gap={1}>
                            <Skeleton variant="rounded" width="100%" height={50} />
                            {isList && (
                                <>
                                    <Skeleton variant="rounded" width="100%" height={50} />
                                    <Skeleton variant="rounded" width="100%" height={50} />
                                </>
                            )}
                        </Box>
                    </motion.div>
                ):(
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >

                {children}
                
                </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}