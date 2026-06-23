"use client";

import { useEffect, useState } from "react";

const FALLBACK_USD_CNY = 6.79;

let cachedRateInfo = null;
let rateInfoPromise = null;

function loadRateInfo() {
  if (cachedRateInfo) return Promise.resolve(cachedRateInfo);
  if (rateInfoPromise) return rateInfoPromise;

  rateInfoPromise = fetch("/api/exchange-rate")
    .then((response) => response.json())
    .then((payload) => {
      const rate = Number(payload?.rate);
      if (Number.isFinite(rate) && rate > 0) {
        cachedRateInfo = payload;
        return payload;
      }
      throw new Error("Invalid exchange rate payload");
    })
    .catch(() => {
      cachedRateInfo = {
        rate: FALLBACK_USD_CNY,
        fallback: true,
        source: "fallback"
      };
      return cachedRateInfo;
    });

  return rateInfoPromise;
}

function formatCny(value) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function Price({ price, priceLabel, compact = false }) {
  const [rateInfo, setRateInfo] = useState({
    rate: FALLBACK_USD_CNY,
    fallback: true,
    source: "fallback"
  });

  useEffect(() => {
    let cancelled = false;

    loadRateInfo()
      .then((payload) => {
        if (cancelled) return;
        const rate = Number(payload?.rate);
        if (Number.isFinite(rate) && rate > 0) {
          setRateInfo(payload);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (price === null) {
    return <span>{priceLabel || "定制报价"}</span>;
  }

  const converted = formatCny(price * rateInfo.rate);
  const rateText = rateInfo.fallback
    ? "按备用汇率换算"
    : `实时汇率 1 美元 = ${Number(rateInfo.rate).toFixed(4)} 元`;

  return (
    <span className="price-cny" title={rateText}>
      <span>{converted}</span>
      {compact ? null : <small>{rateText}</small>}
    </span>
  );
}
