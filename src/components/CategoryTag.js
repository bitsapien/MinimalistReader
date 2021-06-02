import { PropTypes } from 'prop-types'

const CategoryTag = ({ name }) => (<span className="category-tag"> { name } </span>)

CategoryTag.propTypes = {
  name: PropTypes.string
}

export default CategoryTag
