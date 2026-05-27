
function CategoriesButton(){
  const categories = [
    {title: "films"},
    {title: "séries"},
    {title: "animés"},
    {title: "dessin animés"}
  ]
  const types = [
    {title: "entrées"},
    {title: "plats"},
    {title: "desserts"},
    {title: "boissons"}
  ]
  return(
    <div className="button-container">
      <h2 className="section-title">Catégories </h2>
      <div className="categorie-section">
        {categories.map((category)=> (
          <button className="button-catrgory">{category.title}</button>
        ))}
      </div> 
      <div className="type-buttons">
        {types.map((type)=> (
          <button className="button-catrgory">{type.title}</button>
        ))}
      </div>
    </div>
  )
}

export default CategoriesButton;