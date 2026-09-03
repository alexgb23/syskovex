import { useSearch } from "../../context/SearchContext";
import styles from "./IaAutomatizacion.module.css";

function IaAutomatizacion() {
  const { searchQuery } = useSearch();

  // Datos mock (luego vendrán de tu API)
  const items = [
    { id: 1, title: "Elemento 1", category: "ia-automatizacion", description: "Descripción del elemento 1" },
    { id: 2, title: "Elemento 2", category: "ia-automatizacion", description: "Descripción del elemento 2" },
    { id: 3, title: "Elemento 3", category: "ia-automatizacion", description: "Descripción del elemento 3" },
  ];

  // Filtrar por búsqueda
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>IA & Automatización</h1>
      <p className={styles.description}>Inteligencia artificial y automatizaciones</p>

      {searchQuery && (
        <p className={styles.searchInfo}>
          Mostrando {filteredItems.length} resultado{filteredItems.length !== 1 ? "s" : ""} para "{searchQuery}"
        </p>
      )}

      <div className={styles.cardsGrid}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article key={item.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </article>
          ))
        ) : (
          <p className={styles.noResults}>No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
}

export default IaAutomatizacion;
