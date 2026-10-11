const packageCache = new Map();

async function loadPackage(packageName, context, loaderFn) {
  const cached = packageCache.get(packageName);
  if (cached) return cached;
  try {
    const pkg = loaderFn ? await loaderFn() : require(packageName);
    packageCache.set(packageName, pkg);
    return pkg;
  } catch {
    console.error(`The "${packageName}" package is missing. Please, make sure to install it to use ${context}.`);
    process.exit(1);
  }
}

function loadPackageSync(packageName, context, loaderFn) {
  const cached = packageCache.get(packageName);
  if (cached) return cached;
  try {
    const pkg = loaderFn ? loaderFn() : require(packageName);
    packageCache.set(packageName, pkg);
    return pkg;
  } catch {
    console.error(`The "${packageName}" package is missing. Please, make sure to install it to use ${context}.`);
    process.exit(1);
  }
}

function loadPackageCached(packageName, context) {
  const cached = packageCache.get(packageName);
  if (!cached) return loadPackageSync(packageName, context);
  return cached;
}

async function tryLoadPackage(packageName, loaderFn) {
  const cached = packageCache.get(packageName);
  if (cached) return cached;
  try {
    const pkg = loaderFn ? await loaderFn() : require(packageName);
    packageCache.set(packageName, pkg);
    return pkg;
  } catch {
    return null;
  }
}

module.exports = {
  loadPackage,
  loadPackageSync,
  loadPackageCached,
  tryLoadPackage,
};
