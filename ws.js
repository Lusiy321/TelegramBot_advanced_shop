function percent(o, c, h, l) {
  const priceOpCl = ((c - o) / o) * 100;
  const priceHiLo = ((h - l) / l) * 100;

  return console.log(
    `Среднее: ${
      (priceOpCl + priceHiLo) / 2
    } Открытие: ${priceOpCl} Похаям: ${priceHiLo}`
  );
}

percent(100, 80, 108, 77);
