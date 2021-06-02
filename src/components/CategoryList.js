import CategoryTag from './CategoryTag'
import { PropTypes } from 'prop-types'

const CategoryList = ({ categories, handleFilter, filters }) => {
  const relevantCategories = filters.filter(filter => filter.ref.startsWith('category:')).map(filter => filter.ref)

  const filterActiveClass = (category) => relevantCategories.includes(`category:${category}`) ? 'active' : ''

  const list = categories.map((category, index) => (
    <span key={index} className={[filterActiveClass(category.humanised)].join(' ')} onClick={() => handleFilter(category)}>
      <CategoryTag name={category.humanised}/>
    </span>
  ))

  return (<div> {list} </div>)
}

CategoryList.propTypes = {
  categories: PropTypes.array,
  handleFilter: PropTypes.func,
  filters: PropTypes.array
}

export default CategoryList
