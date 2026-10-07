import path from 'node:path';
/** File-system containment, including Windows drive boundaries. */
export function isContained(root, candidate, implementation=path) {
  const rel=implementation.relative(root,candidate);
  return rel!==''&&rel!=='..'&&!rel.startsWith('..'+implementation.sep)&&!implementation.isAbsolute(rel);
}
