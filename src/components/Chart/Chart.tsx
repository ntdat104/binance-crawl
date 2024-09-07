import {
  EntityId,
  IBrokerConnectionAdapterHost,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  ThemeName,
  widget,
} from "@@/public/static/charting_library";
import React from "react";
import BinanceDatafeed from "./binance";
import LocalStorageSaveLoadAdapter from "../../utils/save-data-chart";
import { customCSS } from "@/utils/custom-css";
import { fetchNews, getParameterByName } from "@/utils/chart";
import { formatPrice } from "@/utils/format-price";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setInterval, setSymbol } from "@/redux/slice/websocket-slice";
import clsx from "clsx";

interface Props extends React.ComponentPropsWithoutRef<"div"> {}

const Chart: React.FC<Props> = (props): JSX.Element => {
  const { className, ...rest } = props;
  const dispatch = useAppDispatch();
  const ws = useAppSelector((state) => state.websocket.ws);

  const chartRef = React.useRef<HTMLDivElement>(null);
  const tvWidget = React.useRef<IChartingLibraryWidget>();

  React.useEffect(() => {
    const cssBlob = new Blob([customCSS], {
      type: "text/css",
    });
    const cssBlobUrl = URL.createObjectURL(cssBlob);
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = getParameterByName("theme") || (isDark ? "dark" : "light");
    tvWidget.current = new widget({
      width: chartRef.current?.clientWidth,
      height: chartRef.current?.clientHeight,
      debug: false,
      fullscreen: false,
      symbol: "BTCUSDT",
      interval: "1d" as ResolutionString,
      container: chartRef.current as any,
      //	BEWARE: no trailing slash is expected in feed URL
      datafeed: new BinanceDatafeed({ ws: ws }),
      library_path: "static/charting_library/",
      locale: (getParameterByName("lang") || "vi") as LanguageCode,
      custom_css_url: cssBlobUrl,
      timezone: "Asia/Ho_Chi_Minh",

      disabled_features: [
        // 'use_localstorage_for_settings',
        "open_account_manager",
        "dom_widget",
      ],
      enabled_features: [
        "study_templates",
        "pre_post_market_sessions",
        "show_symbol_logos",
        "show_exchange_logos",
        "seconds_resolution",
        // 'custom_resolutions', // datafeed doesn't support this
        "secondary_series_extend_time_scale",
        // 'determine_first_data_request_size_using_visible_range',
        "show_percent_option_for_right_margin",
        // "display_data_mode",
        "items_favoriting",
        "header_in_fullscreen_mode",
        "side_toolbar_in_fullscreen_mode",
      ],
      overrides: {
        // 'mainSeriesProperties.sessionId': 'extended',
      },
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "trading_platform_demo",
      user_id: "public_user",
      theme: theme as ThemeName,
      save_load_adapter: new LocalStorageSaveLoadAdapter(),
      load_last_chart: true,
      study_count_limit: undefined,
      auto_save_delay: 3,

      custom_formatters: {
        priceFormatterFactory: () => {
          return {
            format: (price: number) => formatPrice(price),
          };
        },
      },
      widgetbar: {
        details: true,
        news: true,
        watchlist: true,
        datawindow: true,
        watchlist_settings: {
          default_symbols: [
            "###CRYPTO",
            "BTCUSDT",
            "ETHUSDT",
            "BNBUSDT",
            "SOLUSDT",
            "XRPUSDT",
            "LINKUSDT",
            "DOTUSDT",
            "ADAUSDT",
          ],
        },
      },

      news_provider: async function getNews(_symbol, callback) {
        let newsItems: any[] = [];
        try {
          newsItems = await fetchNews();
        } catch (e) {
          console.error(e);
        }
        callback({
          title: "Tin tức mới nhất",
          newsItems,
        });
      },

      broker_factory: (_host: IBrokerConnectionAdapterHost) => {
        return null as any;
      },
    });

    tvWidget.current.headerReady().then(() => {
      if (!tvWidget.current) return;

      const themeToggleEl = tvWidget.current.createButton({
        useTradingViewStyle: false,
        align: "right",
      });
      themeToggleEl.dataset.internalAllowKeyboardNavigation = "true";
      themeToggleEl.id = "theme-toggle";
      themeToggleEl.innerHTML = `<label for="theme-switch" id="theme-switch-label">Dark Mode</label>
        <div class="switcher">
          <input type="checkbox" id="theme-switch" tabindex="-1">
          <span class="thumb-wrapper">
            <span class="track"></span>
            <span class="thumb"></span>
          </span>
        </div>`;
      themeToggleEl.title = "Toggle theme";
      const checkboxEl = themeToggleEl.querySelector("#theme-switch") as any;
      checkboxEl.checked = theme === "dark";
      checkboxEl.addEventListener("change", function () {
        const themeToSet = checkboxEl.checked ? "dark" : "light";
        tvWidget.current?.changeTheme(themeToSet, { disableUndo: true });
      });

      const themeSwitchCheckbox = themeToggleEl.querySelector(
        "#theme-switch"
      ) as Element;

      const handleRovingTabindexMainElement = (e) => {
        e.target.tabIndex = 0;
      };
      const handleRovingTabindexSecondaryElement = (e) => {
        e.target.tabIndex = -1;
      };

      themeSwitchCheckbox.addEventListener(
        "roving-tabindex:main-element",
        handleRovingTabindexMainElement
      );
      themeSwitchCheckbox.addEventListener(
        "roving-tabindex:secondary-element",
        handleRovingTabindexSecondaryElement
      );
    });
  }, []);

  React.useEffect(() => {
    tvWidget.current?.onChartReady(() => {
      const activeChart = tvWidget.current?.activeChart();
      activeChart?.onSymbolChanged().subscribe(null, () => {
        dispatch(setSymbol(tvWidget.current?.activeChart().symbol() as string));
      });
      activeChart?.onIntervalChanged().subscribe(null, () => {
        const resolution = tvWidget.current?.activeChart().resolution() as any;
        const interval = {
          1: "1m",
          3: "3m",
          5: "5m",
          15: "15m",
          30: "30m",
          60: "1h",
          120: "2h",
          240: "4h",
          360: "6h",
          480: "8h",
          720: "12h",
          D: "1d",
          "1D": "1d",
          "3D": "3d",
          W: "1w",
          "1W": "1w",
          M: "1M",
          "1M": "1M",
        }[resolution];
        dispatch(setInterval(interval as string));
      });
    });
  }, []);

  React.useEffect(() => {
    tvWidget.current?.onChartReady(() => {
      tvWidget.current?.activeChart().getSeries().setChartStyleProperties(1, {
        upColor: "#2EBD85",
        downColor: "#F6465D",
        borderUpColor: "#2EBD85",
        borderDownColor: "#F6465D",
      });

      const allStudies = tvWidget.current?.activeChart()?.getAllStudies();
      const volumeId = allStudies?.find((c) => c.name === "Volume")
        ?.id as EntityId;
      const volume = tvWidget.current?.activeChart().getStudyById(volumeId);
      volume?.applyOverrides({
        "volume.color.0": "#F6465D",
        "volume.color.1": "#2EBD85",
      });

      const chart = tvWidget.current?.activeChart();
      [
        { length: 7, color: "#FF9800" },
        { length: 25, color: "#3179F5" },
        { length: 99, color: "#4CAF50" },
      ].forEach((item) => {
        chart?.createStudy(
          "Moving Average Exponential",
          true,
          false,
          {
            length: item.length,
          },
          {
            "Plot.color": item.color,
          }
        );
      });
    });
  }, []);

  return (
    <div
      ref={chartRef}
      className={clsx("w-full h-full", className)}
      {...rest}
    />
  );
};

export default Chart;
