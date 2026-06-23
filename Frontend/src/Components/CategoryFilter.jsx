import { ChevronDown } from "lucide-react";

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mb-12 flex items-center gap-4">
      <label className="font-semibold">
        Filter by Category:
      </label>

      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="appearance-none bg-white border-2 border-gray-300 py-2 px-4 pr-8 rounded-lg"
        >
          <option value="all">All Products</option>

          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={category.categoryId}
            >
              {category.categoryName}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="absolute right-2 top-3"
        />
      </div>
    </div>
  );
};

export default CategoryFilter;