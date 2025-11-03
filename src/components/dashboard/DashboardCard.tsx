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
          m: 1,
          backgroundColor: backgroundColor
        }}
      >
        <Typography
          sx={{
            color: textColor,
            height: "auto",
            fontSize: 20, // tamaño original
            '@media (max-width:1350px)': {
              fontSize: 16, // se achica entre 0 y 1350px
            },
            '@media (min-width:1200px)': {
              fontSize: 20, // vuelve al original desde 1200px
            },
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: textColor,
            fontSize: 40, // tamaño original
            '@media (max-width:1350px)': {
              fontSize: 30, // se achica entre 0 y 1350px
            },
            '@media (min-width:1200px)': {
              fontSize: 40, // vuelve al original desde 1200px
            },
          }}
        >
          {count}
        </Typography>
      </CardContent>

      <ChevronRight
        className="size-10 w-15 h-15 shrink-0"
        style={{ color: textColor }}
      />
    </Card>
  );
}