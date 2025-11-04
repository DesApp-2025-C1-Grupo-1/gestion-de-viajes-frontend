import { Card, CardContent, Typography } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { object } from "zod";

export default function DashboardCard({
  title,
  count,
  backgroundColor,
  textColor,
  link,
  external = false,
}: {
  title: string;
  count: number;
  backgroundColor: string;
  textColor: string;
  link: string | { pathname: string; state?: any };
  external?: boolean;
}) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (!link) return;
    if (external) window.location.href = typeof link === "string" ? link : link.pathname;
    else {
      if (typeof link === "string") navigate(link);
      else navigate(link.pathname, { state: link.state });
    }
  };

  return (
    <Card
      sx={{
        height: "auto",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 2,
        backgroundColor: backgroundColor,
        border: `1px solid #C7C7C7`,
        cursor: "pointer",
        padding: "8px", // reducimos padding general
      }}
      onClick={handleRedirect}
    >
      <CardContent
        sx={{
          flex: "1 0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          p: 0,
          m: 0,
        }}
      >
        <Typography
          sx={{
            color: textColor,
            fontSize: 18, // un poco más pequeño
            lineHeight: 1.2,
            '@media (max-width:1350px)': {
              fontSize: 16,
            },
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: textColor,
            fontSize: 32, // reducimos tamaño de número
            fontWeight: 600,
            lineHeight: 1.2,
            '@media (max-width:1350px)': {
              fontSize: 28,
            },
          }}
        >
          {count}
        </Typography>
      </CardContent>

      <ChevronRight
        className="size-10 w-12 h-12 shrink-0" // icono más pequeño
        style={{ color: textColor }}
      />
    </Card>
  );
}
