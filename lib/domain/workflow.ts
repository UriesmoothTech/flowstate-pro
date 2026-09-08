sed -n '1,220p' lib/domain/workflow.ts

echo "=== LIFECYCLE ==="
sed -n '1,260p' lib/services/workflow-execution-lifecycle-service.ts

echo "=== REPOSITORY ==="
sed -n '1,220p' lib/repositories/workflow-execution-repository.ts

echo "=== TESTS ==="
sed -n '1,300p' tests/workflow-execution-lifecycle-service.test.ts

