/* Sitio de muestra: entradas de texto, carta completa y pedido por WhatsApp.
   La pizza 3D de la portada está en js/pizza3d.js */

document.documentElement.classList.replace('no-js', 'js');

const WA = '';   // versión de muestra: sin número
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ======================================================================
   Carta (precios de referencia tomados de Rappi; confirmar con el negocio)
   "fotos" son los nombres de archivo en img/menu/ (.webp), en el orden de los platos.
   Vacío = sin foto.
   ====================================================================== */
const MENU = [
  { id: 'tradicionales', nombre: 'Pizzas tradicionales', nota: 'Precio desde. Tamaño a elegir.', fotos: ['napolitana','hawaiana','pollo-champinones','campesina','mexicana','carnes','vegetariana','bocadillo-queso','chorizo-maiz','carne-molida-maiz','pollo-maiz','solo-pollo','primavera','pepperoni'], items: [
    ['Napolitana', 'Tomate fresco, queso y especias', 15000],
    ['Hawaiana', 'Jamón, piña y queso', 15000],
    ['Pollo y champiñones', 'Pollo, champiñones, queso y jamón', 15000],
    ['Campesina', 'Carne desmechada, maduro, maíz y tocineta', 15000],
    ['Mexicana', 'Carne molida, cebolla, pimentón, jalapeños y maíz', 15000],
    ['Carnes', 'Salami, chorizo, cábano y salchichón', 15000],
    ['Vegetariana', 'Tomate, cebolla, maíz, pimentón y champiñones', 15000],
    ['Bocadillo con queso', 'Bocadillo y queso', 15000],
    ['Chorizo y maíz', 'Chorizo, maíz y queso', 15000],
    ['Carne molida y maíz', 'Carne molida y maíz', 15000],
    ['Pollo y maíz', 'Pollo, maíz y queso', 15000],
    ['Solo pollo', 'Pollo, queso y champiñones', 15000],
    ['Primavera', 'Jamón, tocineta, maíz y pimentón', 15000],
    ['Pepperoni', 'Queso y pepperoni', 18000],
  ] },
  { id: 'especiales', nombre: 'Pizzas especiales', nota: 'Precio desde. Tamaño a elegir.', fotos: ['especial-pizzeria','especial-casa','serrata','pizza-brasa','pepperoni-pina','pork-bbq','marinera','cuatro-quesos','bbq'], items: [
    ['Especial Pizzería', 'Camarones, pollo, tocineta, chorizo, pimentón, cebolla, champiñones y maíz', 18000],
    ['Especial de la casa', 'Salami, chorizo, pepperoni, pollo, tocineta, pimentón, cebolla, cábano y maíz', 18000],
    ['Serrata artesanal', 'Salsa napolitana, mozzarella, rúcula, jamón serrano y parmesano', 19000],
    ['A la brasa', 'Pollo a la brasa, chorizo y pimentón', 18000],
    ['Pepperoni y piña', 'Pepperoni y piña', 18000],
    ['Pork BBQ', 'Chuleta de cerdo ahumada, salsa napolitana, mozzarella y BBQ', 18000],
    ['Marinera', 'Camarones y palmitos de cangrejo', 18000],
    ['Cuatro quesos', 'Mozzarella, americano, queso azul y parmesano', 18000],
    ['BBQ', 'Pollo, maíz, tocineta y salsa BBQ', 18000],
  ] },
  { id: 'hamburguesas', nombre: 'Hamburguesas', nota: 'Todas con papas a la francesa.', fotos: ['hamb-tradicional','hamb-mixta','hamb-brasa','hamb-americana','hamb-house','hamb-pork','hamb-pork-cheese'], items: [
    ['Tradicional', 'Carne de 150 g, cheddar, chorizo, tocineta, cebolla grille y vegetales', 24000],
    ['Mixta', 'Filete de pechuga de 150 g, tocineta, mozzarella y vegetales', 26000],
    ['A la brasa', 'Carne y pollo a la brasa, tocineta, mozzarella y vegetales', 28000],
    ['Americana', 'Doble carne de 150 g, cheddar, tocineta y cebolla grille', 28000],
    ['La House', 'Doble carne, huevo, doble cheddar, tocineta y cebolla grille', 28000],
    ['Pork', 'Carne de 150 g, chuleta de cerdo ahumada, tocineta y mozzarella', 30000],
    ['Pork Cheese', 'Chuleta de cerdo a la brasa y combinación de quesos', 31000],
  ] },
  { id: 'perros', nombre: 'Perros', nota: '', fotos: ['perro-tradicional','perro-brasa','perro-loco'], items: [
    ['Tradicional', 'Salchicha americana, cebolla grille, pollo, quesos, tocineta y papas', 20000],
    ['A la brasa', 'Salchicha, cebolla, tocineta, carne, pollo a la brasa y mozzarella', 25000],
    ['Loco House', 'Salchicha americana, pollo y carne desmechados, cheddar, tocineta y papas', 25000],
  ] },
  { id: 'papitas', nombre: 'Papitas', nota: '', fotos: ['papas-fritas','choripapa','salchipapa','papas-locas','papas-locas-especiales'], items: [
    ['Papas fritas', 'Porción con salsas', 10000],
    ['Choripapa', 'Papas, chorizo, tocineta, cheddar y queso blanco', 18000],
    ['Salchipapa', 'Papas, salchicha, tocineta, cheddar y queso blanco', 18000],
    ['Papas locas', 'Pollo, carne a la brasa, mozzarella, chorizo, cebolla grille, maíz y tártara', 25000],
    ['Papas locas especiales', 'Carne y pollo desmechados, chuleta BBQ, tocineta, mozzarella y chorizo', 27000],
  ] },
  { id: 'panzerottis', nombre: 'Panzerottis y tortillas', nota: 'Las tortillas vienen por 3 unidades.', fotos: ['panzerotti-tradicional','panzerotti-especial','panzerotti-cuatro-quesos','tortillas-integrales','tortillas-tradicionales','tortillas-especiales'], items: [
    ['Panzerotti tradicional', 'Porción individual, sabor a elegir', 22000],
    ['Panzerotti especial', 'Porción individual, relleno a elección', 24000],
    ['Panzerotti cuatro quesos', 'Mozzarella, americano, queso azul y parmesano', 28000],
    ['Tortillas integrales', 'Carne y pollo desmechados con vegetales del día', 15000],
    ['Tortillas tradicionales', 'Relleno a elegir', 16000],
    ['Tortillas especiales', 'Relleno a elección', 18000],
  ] },
  { id: 'platos', nombre: 'Entradas, lasaña y parrilla', nota: '', fotos: ['papa-criolla','palitos-queso','lasana','pechuga','chatas'], items: [
    ['Papa criolla de la casa', 'Con pollo desmechado, mozzarella, tocineta, cheddar y BBQ', 13000],
    ['Palitos de queso y arequipe', '5 unidades', 16700],
    ['Lasaña', 'Boloñesa, pollo desmechado, carne molida y mozzarella', 24000],
    ['Pechuga a la parrilla', '350 g con ensalada del día y papas', 29000],
    ['Chatas a la parrilla', '350 g con chimichurri, queso asado, ensalada y papas', 30000],
  ] },
  { id: 'bebidas', nombre: 'Bebidas', nota: 'Cócteles y helados en el rooftop.', fotos: ['agua','coca-cola','jugo-agua','jugo-leche','granizado'], items: [
    ['Agua Cristal 300 ml', 'Sin gas', 5000],
    ['Coca-Cola 400 ml', 'Original', 5000],
    ['Jugo en agua 16 oz', 'Sabor del día', 7000],
    ['Jugo en leche 16 oz', 'Sabor del día', 8000],
    ['Granizado 16 oz', 'Sabor a elegir', 8000],
  ] },
];

const money = n => '$' + n.toLocaleString('es-CO');

/* ======================================================================
   Entradas de texto
   ====================================================================== */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ======================================================================
   Carta y pedido
   ====================================================================== */
// Foto del encabezado de cada categoría (img/menu/<foto>.webp)
const BANNERS = {
  tradicionales: 'hawaiana', especiales: 'especial-casa', hamburguesas: 'hamb-house', perros: 'perro-loco',
  papitas: 'papas-locas-especiales', panzerottis: 'panzerotti-cuatro-quesos', platos: 'chatas', bebidas: 'granizado',
};
// Fila de destacados: [categoría, nombre del plato]
const DESTACADOS = [
  ['especiales', 'Especial Pizzería'], ['tradicionales', 'Campesina'], ['hamburguesas', 'La House'],
  ['perros', 'Loco House'], ['papitas', 'Papas locas especiales'], ['panzerottis', 'Panzerotti cuatro quesos'],
];

const list = document.getElementById('menu-list');
const chips = document.getElementById('chips');
const rail = document.getElementById('rail');
const cart = new Map();
const byId = new Map();
const PLUS = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const isPizza = id => id === 'tradicionales' || id === 'especiales';

// Destella las piezas de un plato al entrar, una tras otra (subida, puntos, precio, botón)
const itemIo = new IntersectionObserver(entries => {
  let k = 0;
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.style.setProperty('--d', (k++ * 70) + 'ms');
    en.target.classList.add('show');
    itemIo.unobserve(en.target);
  });
}, { rootMargin: '0px 0px -8% 0px' });

MENU.forEach(cat => {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.dataset.cat = cat.id;
  chip.textContent = cat.nombre;
  chips.appendChild(chip);

  const sec = document.createElement('section');
  sec.className = 'cat rv';
  sec.id = 'cat-' + cat.id;
  sec.setAttribute('aria-labelledby', 'h-' + cat.id);
  sec.innerHTML = `
    <div class="cat__media">
      <div class="cat__banner"><img src="img/menu/${BANNERS[cat.id]}.webp" alt="" loading="lazy" width="676" height="676"></div>
      <div class="cat__head"><span class="cat__count">${cat.items.length} ${cat.items.length === 1 ? 'plato' : 'platos'}</span><h2 id="h-${cat.id}">${cat.nombre}</h2></div>
    </div>
    ${cat.nota ? `<p class="cat__note">${cat.nota}</p>` : ''}
    <ul class="items"></ul>`;

  const ul = sec.querySelector('.items');
  cat.items.forEach(([nombre, desc, precio], k) => {
    const id = `${cat.id}-${k}`;
    const full = cat.id === 'hamburguesas' ? `Hamburguesa ${nombre}` : cat.id === 'perros' ? `Perro ${nombre}` : isPizza(cat.id) ? `Pizza ${nombre}` : nombre;
    byId.set(id, { nombre: full, corto: nombre, precio, pizza: isPizza(cat.id), cat: cat.id, foto: cat.fotos[k] });
    const li = document.createElement('li');
    li.className = 'item pi';
    li.id = 'it-' + id;
    li.dataset.search = `${nombre} ${desc}`.toLowerCase();
    li.innerHTML = `
      <div class="item__top">
        <span class="item__name">${nombre}</span>
        <span class="dots" aria-hidden="true"></span>
        <span class="price">${precio ? `${isPizza(cat.id) ? '<small>desde</small> ' : ''}${money(precio)}` : 'Consultar'}</span>
        <button type="button" class="add" data-id="${id}" aria-label="Agregar ${full} al pedido">${PLUS}</button>
      </div>
      <p class="item__desc">${desc}</p>`;
    ul.appendChild(li);
    itemIo.observe(li);
  });
  list.appendChild(sec);
  io.observe(sec);
});

// Fila de destacados
DESTACADOS.forEach(([catId, nombre]) => {
  const cat = MENU.find(c => c.id === catId);
  const k = cat ? cat.items.findIndex(it => it[0] === nombre) : -1;
  if (k < 0) return;
  const id = `${catId}-${k}`, it = byId.get(id);
  if (!it.foto) return;
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'card';
  card.dataset.go = id;
  card.innerHTML = `
    <div class="card__img"><img src="img/menu/${it.foto}.webp" alt="${it.nombre}" loading="lazy" width="676" height="676"></div>
    <div class="card__txt"><small>${cat.nombre}</small><b>${it.corto}</b><em>${it.precio ? (it.pizza ? 'desde ' : '') + money(it.precio) : 'Consultar'}</em></div>`;
  rail.appendChild(card);
});

// Desplazamiento con margen para la barra principal y la de categorías
const menuNav = document.querySelector('.menu-nav');
function goTo(el) {
  const off = (document.querySelector('.nav')?.offsetHeight || 64) + menuNav.offsetHeight + 12;
  scrollTo({ top: el.getBoundingClientRect().top + scrollY - off, behavior: reduce ? 'auto' : 'smooth' });
}
chips.addEventListener('click', e => {
  const b = e.target.closest('.chip');
  if (b) goTo(document.getElementById('cat-' + b.dataset.cat));
});
rail.addEventListener('click', e => {
  const c = e.target.closest('.card');
  if (!c) return;
  const li = document.getElementById('it-' + c.dataset.go);
  li.classList.add('show');
  goTo(li);
  li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash');
});

// Píldora activa según la categoría en pantalla, y línea de progreso de la carta
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const id = en.target.id.slice(4);
    chips.querySelectorAll('.chip').forEach(c => {
      const on = c.dataset.cat === id;
      c.setAttribute('aria-current', on ? 'true' : 'false');
      if (on) chips.scrollTo({ left: c.offsetLeft - chips.offsetWidth / 2 + c.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
}, { rootMargin: '-35% 0px -60% 0px' });
list.querySelectorAll('.cat').forEach(s => spy.observe(s));

const progress = document.getElementById('menu-progress');
addEventListener('scroll', () => {
  const r = list.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / r.height));
  progress.style.transform = `scaleX(${p.toFixed(3)})`;
}, { passive: true });

// Búsqueda
const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('menu-search');
const q = document.getElementById('menu-q');
const empty = document.getElementById('menu-empty');
searchBtn.addEventListener('click', () => {
  const on = !searchBox.classList.contains('on');
  searchBox.classList.toggle('on', on);
  searchBtn.setAttribute('aria-expanded', on);
  if (on) q.focus(); else { q.value = ''; filter(''); }
});
const norm = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function filter(text) {
  const t = norm(text.trim());
  let any = false;
  list.querySelectorAll('.cat').forEach(sec => {
    let n = 0;
    sec.querySelectorAll('.item').forEach(li => {
      const ok = !t || norm(li.dataset.search).includes(t);
      li.hidden = !ok;
      if (ok) { n++; li.classList.add('show'); }
    });
    sec.hidden = n === 0;
    if (n) any = true;
  });
  empty.hidden = any;
}
q.addEventListener('input', () => filter(q.value));

// Pedido
const bar = document.getElementById('bar');
const sheet = document.getElementById('sheet');
const scrimO = document.getElementById('scrim-order');
const lines = document.getElementById('sheet-lines');

function setQty(id, n) {
  n > 0 ? cart.set(id, n) : cart.delete(id);
  const btn = list.querySelector(`.add[data-id="${id}"]`);
  if (btn) {
    btn.classList.toggle('done', n > 0);
    btn.innerHTML = n > 0 ? `<span>${n}</span>` : PLUS;
    btn.setAttribute('aria-label', n > 0 ? `${byId.get(id).nombre}: ${n} en el pedido. Agregar otro` : `Agregar ${byId.get(id).nombre} al pedido`);
  }
  drawOrder();
}

list.addEventListener('click', e => {
  const b = e.target.closest('.add');
  if (!b) return;
  setQty(b.dataset.id, (cart.get(b.dataset.id) || 0) + 1);
  bar.classList.remove('bump'); void bar.offsetWidth; bar.classList.add('bump');
});

function drawOrder() {
  let n = 0, total = 0, consultar = false, pizza = false;
  const msgLines = [];
  lines.innerHTML = '';
  cart.forEach((qty, id) => {
    const it = byId.get(id);
    n += qty; total += it.precio * qty;
    if (!it.precio) consultar = true;
    if (it.pizza) pizza = true;
    msgLines.push(`• ${qty} × ${it.nombre}${it.precio ? ' — ' + money(it.precio * qty) : ''}`);
    const row = document.createElement('div');
    row.className = 'line';
    row.innerHTML = `
      <div class="line__name"><b>${it.nombre}</b><small>${it.precio ? money(it.precio) + ' c/u' : 'Precio por consultar'}</small></div>
      <div class="qty">
        <button type="button" data-q="-1" data-id="${id}" aria-label="Quitar uno de ${it.nombre}">−</button>
        <span aria-live="polite">${qty}</span>
        <button type="button" data-q="1" data-id="${id}" aria-label="Agregar otro de ${it.nombre}">+</button>
      </div>`;
    lines.appendChild(row);
  });
  if (!n) lines.innerHTML = '<p class="line-empty">Tu pedido está vacío. Toca + en la carta para agregar algo.</p>';

  bar.classList.toggle('on', n > 0);
  document.getElementById('bar-count').textContent = n;
  document.getElementById('bar-total').textContent = money(total);
  document.getElementById('sheet-total').textContent = money(total);

  const mode = document.querySelector('input[name="mode"]:checked').value;
  const name = document.getElementById('f-name').value.trim();
  const addr = document.getElementById('f-addr').value.trim();
  const notes = document.getElementById('f-notes').value.trim();
  const msg = [
    'Hola, quiero hacer este pedido:', '', ...msgLines, '',
    `Total aproximado: ${money(total)}`,
    pizza ? '(Pizzas: el tamaño lo confirmo con ustedes.)' : '',
    consultar ? '(Hay productos con precio por consultar.)' : '',
    '', `Modo: ${mode}`, `Nombre: ${name}`,
    mode === 'Domicilio' ? `Dirección: ${addr}` : '',
    notes ? `Notas: ${notes}` : '',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n').trim();
  document.getElementById('order-send').href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

lines.addEventListener('click', e => {
  const b = e.target.closest('button[data-q]');
  if (!b) return;
  setQty(b.dataset.id, (cart.get(b.dataset.id) || 0) + +b.dataset.q);
  const again = lines.querySelector(`button[data-id="${b.dataset.id}"][data-q="${b.dataset.q}"]`);
  (again || document.getElementById('sheet-title')).focus();
});
sheet.addEventListener('input', drawOrder);
sheet.addEventListener('change', () => {
  document.getElementById('field-addr').hidden = document.getElementById('mode-local').checked;
  drawOrder();
});

let lastFocus = null;
function openSheet() {
  lastFocus = document.activeElement;
  sheet.hidden = false;
  requestAnimationFrame(() => { sheet.classList.add('on'); scrimO.classList.add('on'); });
  document.getElementById('sheet-title').focus({ preventScroll: true });
}
function closeSheet() {
  sheet.classList.remove('on'); scrimO.classList.remove('on');
  setTimeout(() => { if (!sheet.classList.contains('on')) sheet.hidden = true; }, 350);
  lastFocus && lastFocus.focus({ preventScroll: true });
}
document.getElementById('bar-btn').addEventListener('click', openSheet);
document.getElementById('sheet-close').addEventListener('click', closeSheet);
scrimO.addEventListener('click', closeSheet);
addEventListener('keydown', e => { if (e.key === 'Escape' && sheet.classList.contains('on')) closeSheet(); });

drawOrder();
