const TEST_TYPE_WEIGHT = {
  eslint: 1,
  unit: 10,
  integration: 20,
  acceptance: 150
};
const WEIGHT_REGEX = /\/(eslint|unit|integration|acceptance)\//;
const DEFAULT_WEIGHT = 50;

/**
 * Return the weight for a given module name, a file path to the module
 * Ember tests consist of Acceptance, Integration, Unit, and lint tests. In general, acceptance takes
 * longest time to execute, followed by integration and unit.
 * The weight assigned to a module corresponds to its test type execution speed, with slowest being the highest in weight.
 * If the test type is not identifiable from the modulePath, weight default to 50 (ordered after acceptance, but before integration)
 *
 * @param {string} modulePath File path to a module
 */
function getWeight(modulePath) {
  const [, key] = WEIGHT_REGEX.exec(modulePath) || [];
  if (typeof TEST_TYPE_WEIGHT[key] === 'number') {
    return TEST_TYPE_WEIGHT[key];
  } else {
    return DEFAULT_WEIGHT;
  }
}

/**
 * Returns the list of modules sorted by its weight
 *
 * @export
 * @param {Array<string>} modules
 * @returns {Array<string>}
 */
export default function weightTestModules(modules) {
  const groups = new Map();

  modules.forEach((module) => {
    const moduleWeight = getWeight(module);

    if (Array.isArray(groups[moduleWeight])) {
      groups[moduleWeight].push(module);
    } else {
      groups[moduleWeight] = [module];
    }
  });

  // return modules sorted by weight and alphabetically within its weighted groups
  return Object.keys(groups)
    .sort((a, b) =>  b - a)
    .reduce((accumulatedArray, weight) => {
      const sortedModuleArr = groups[weight].sort();
      return accumulatedArray.concat(sortedModuleArr);
    }, []);
}
