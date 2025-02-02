import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import "cal-heatmap/cal-heatmap.css";
import { useEffect, useRef } from "react";

export const HeatMap = () => {
  const rendered = useRef(false);
  const data = [
    { date: "2025-03-01", value: 3 },
    { date: "2025-03-02", value: 6 },
  ];

  useEffect(() => {
    if (!rendered.current) {
      const cal = new CalHeatmap();
      cal.paint(
        {
          range: 12,
          scale: {
            color: {
              type: "threshold",
              range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
              domain: [10, 20, 30],
            },
          },
          domain: {
            type: "month",
            gutter: 4,
            label: { text: "MMM", textAlign: "start", position: "top" },
          },
          subDomain: {
            type: "ghDay",
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
          data: { source: data, x: 'date', y: 'value', },
        },
        [
          [
            Tooltip,
            {
              text: function (date, value, dayjsDate) {
                return (
                  (value ? value : "No") +
                  " contributions on " +
                  dayjsDate.format("dddd, MMMM D, YYYY")
                );
              },
            },
          ],
        ],
      );
    }
    rendered.current = true;
  }, []);

  return <div id="cal-heatmap"></div>;
};
