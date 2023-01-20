/**
 * Prevents the same document from being referenced multiple times in an array
 * of references. Pass as the value to the `filter` option on the reference
 * declaration itself (not the array).
 *
 * @example
 * const field = {
 *   type: "array",
 *   of: [
 *     {
 *       type: "reference",
 *       to: [{ type: "someDocumentType" }],
 *       options: {
 *         filter: noDuplicateRefs,
 *       },
 *     },
 *   ],
 * }
 */
export const noDuplicateRefs = ({ parent }) => {
  const existingRefs = parent.map((item) => item._ref).filter(Boolean)

  return existingRefs.length
    ? {
        filter: "!(_id in $ids)",
        params: {
          ids: existingRefs,
        },
      }
    : true
}
